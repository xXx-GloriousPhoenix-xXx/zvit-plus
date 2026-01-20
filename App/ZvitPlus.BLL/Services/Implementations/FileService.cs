using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using ZvitPlus.BLL.Context;
using ZvitPlus.BLL.DTOs.AdditionalDTOs;
using ZvitPlus.BLL.DTOs.FileDTOs;
using ZvitPlus.BLL.DTOs.FileEntityDTOs;
using ZvitPlus.BLL.Services.Enums;
using ZvitPlus.BLL.Services.Exceptions;
using ZvitPlus.BLL.Services.Interfaces;
using ZvitPlus.DAL.Models.Enums;
using ZvitPlus.BLL.Services.Logging;
using Microsoft.Extensions.Configuration;
using ZvitPlus.DAL.Models.Entities;
using ZvitPlus.DAL.Repositories.Interfaces;
using AutoMapper;

namespace ZvitPlus.BLL.Services.Implementations
{
    public class FileService(IUnitOfWork unitOfWork, IMapper mapper, ILogger<FileService> logger, IConfiguration configuration) : IFileService
    {
        private readonly IUnitOfWork _unitOfWork = unitOfWork;
        private readonly IMapper _mapper = mapper;
        private readonly ILogger<FileService> _logger = logger;
        private const string _fileExtension = "rep";
        private readonly string _basePath = configuration["DataStorage:BasePath"]!;

        public async Task<bool> ExistsAsync(Guid entityId, CancellationToken ct = default)
        {
            AppLogger.LogActionStarted(_logger, "пошук файлу", entityId);
            var exists = await _unitOfWork.Files.GetByIdAsync(entityId, ct);
            AppLogger.LogActionCompleted(_logger, "Пошук файлу", entityId);
            return exists is not null;
        }

        public async Task<(Guid fileId, string filePath)> AddAsync(CreateFileDTO dto, Guid authorId, CancellationToken ct = default)
        {
            AppLogger.LogActionStarted(_logger, "збереження фалу");

            var fileId = Guid.NewGuid();
            var filePath = GetDirectoryPath(authorId, dto.Type, fileId);
            var dirPath = Path.GetDirectoryName(filePath)!;

            var entity = new FileEntity
            {
                Id = fileId,
                Name = Path.GetFileNameWithoutExtension(dto.Name),
                AuthorId = authorId,
                FileSize = dto.File.Length,
                FilePath = filePath,
                IsPrivate = dto.IsPrivate,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            if (!Directory.Exists(dirPath))
            {
                Directory.CreateDirectory(dirPath!);
            }

            await SaveToDiskAsync(dto.File, filePath, ct);

            _unitOfWork.Files.Add(entity);

            return (fileId, filePath);
        }

        public async Task<FileEntity> UpdateAsync(Guid entityId, UpdateFileDTO dto, CancellationToken ct = default)
        {
            AppLogger.LogActionStarted(_logger, "оновлення файлу", entityId);

            var entity = await _unitOfWork.Files.GetByIdAsync(entityId, ct);
            if (entity is null)
            {
                AppLogger.LogActionFailed(_logger, "оновлення файлу");
                throw new BusinessException("Файл не знайдено");
            }

            string? backupFilePath = null;

            try
            {
                // НЕ начинаем новую транзакцию - используем существующую из ReportService
                if (dto.File is not null)
                {
                    if (File.Exists(entity.FilePath))
                    {
                        backupFilePath = entity.FilePath + ".backup";
                        File.Copy(entity.FilePath, backupFilePath, true);
                    }

                    await SaveToDiskAsync(dto.File, entity.FilePath, ct);

                    var fileInfo = new FileInfo(entity.FilePath);
                    entity.FileSize = fileInfo.Length;
                }

                if (dto.Name is not null)
                {
                    entity.Name = dto.Name;
                }

                if (dto.IsPrivate.HasValue)
                {
                    entity.IsPrivate = dto.IsPrivate.Value;
                }

                _unitOfWork.Files.Update(entity);

                // ВАЖНО: Сохраняем изменения
                await _unitOfWork.CompleteAsync(ct);  // ← Добавить эту строку

                AppLogger.LogActionCompleted(_logger, "Оновлення файлу", entityId);

                return entity;
            }
            catch (Exception ex)  // ← Добавить логгирование конкретной ошибки
            {
                AppLogger.LogActionFailed(_logger, "оновлення файлу", entityId);

                // Удалить ненужный rollback - пусть ReportService управляет транзакцией
                // await _unitOfWork.RollbackTransactionAsync(ct);

                if (backupFilePath is not null && File.Exists(backupFilePath))
                {
                    if (File.Exists(entity.FilePath))
                    {
                        File.Delete(entity.FilePath);
                    }
                    File.Move(backupFilePath, entity.FilePath);

                    if (File.Exists(entity.FilePath))
                    {
                        var fileInfo = new FileInfo(entity.FilePath);
                        entity.FileSize = fileInfo.Length;
                    }
                }

                throw new BusinessException($"Помилка оновлення файлу: {ex.Message}");
            }
            finally
            {
                if (backupFilePath is not null && File.Exists(backupFilePath))
                {
                    try
                    {
                        File.Delete(backupFilePath);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning($"Не вдалося видалити backup файл: {ex.Message}");
                    }
                }
            }
        }

        public async Task<GetFileEntityDTO?> GetByIdAsync(Guid entityId, CancellationToken ct = default)
        {
            var entity = await _unitOfWork.Files.GetByIdAsync(entityId, ct,
                f => f.Author,
                f => f.Template!.TemplateType,
                f => f.Report!.Template!.TemplateType);
            var response = _mapper.Map<GetFileEntityDTO>(entity);
            return response;
        }

        public async Task DeleteAsync(Guid entityId, UserContext context, CancellationToken ct = default)
        {
            AppLogger.LogActionStarted(_logger, "видалення файлу", entityId);

            var entity = await _unitOfWork.Files.GetByIdAsync(entityId, ct);
            if (entity is null || entity.IsDeleted)
            {
                AppLogger.LogActionFailed(_logger, "видалення файлу", entityId);
                throw new BusinessException("Файл не знайдено");
            }

            var author = await _unitOfWork.Users.GetByIdAsync(entity.AuthorId, ct);
            if (author is null)
            {
                AppLogger.LogActionFailed(_logger, "видалення файлу", entityId);
                throw new BusinessException("Автора не знайдено");
            }

            if (context.UserId != author.Id && context.Role <= author.Role)
            {
                AppLogger.LogAccessDenied(_logger, context.UserId);
                throw new BusinessException("Неможливо видалити файл");
            }

            entity.IsDeleted = true;
            _unitOfWork.Files.Update(entity);


            await _unitOfWork.BeginTransactionAsync(ct);
            try
            {
                await _unitOfWork.CompleteAsync(ct);
                await _unitOfWork.CommitTransactionAsync(ct);

                AppLogger.LogActionCompleted(_logger, "Видалення файлу", entityId);
            }
            catch
            {
                await _unitOfWork.RollbackTransactionAsync(ct);

                AppLogger.LogActionFailed(_logger, "видалення файлу", entityId);
                throw new BusinessException("Помилка видалення файлу");
            }
        }

        public async Task<PagedResponse<GetFileEntityDTO>> GetPageAsync(UserContext context, FileType ft, int page = 1, int pageSize = 10, SearchFileEntityDTO? search = null, CancellationToken ct = default)
        {
            if (page < 1)
            {
                page = 1;
            }
            if (pageSize < 2)
            {
                pageSize = 10;
            }
            if (pageSize > 50)
            {
                pageSize = 50;
            }

            var query = _unitOfWork.Files.AsQueryable();

            // Типізація
            if (ft == FileType.Template)
            {
                query = query.Where(f => f.Template != null);
            }
            else
            {
                query = query.Where(f => f.Report != null);
            }

            // Фільтрація користувача
            if (search is not null)
            {
                if (search.Name is not null)
                {
                    query = query.Where(f => f.Name == search.Name);
                }
                if (search.Author is not null)
                {
                    query = query.Where(f => f.Author!.Login == search.Author);
                }
                if (search.TemplateType is not null)
                {
                    query = query.Where(f => f.Template!.TemplateType!.Name == search.TemplateType);
                }
                if (search.CreatedFrom is not null)
                {
                    query = query.Where(f => f.CreatedAt >= search.CreatedFrom);
                }
                if (search.CreatedTo is not null)
                {
                    query = query.Where(f => f.CreatedAt <= search.CreatedTo);
                }
                if (search.UpdatedFrom is not null)
                {
                    query = query.Where(f => f.UpdatedAt >= search.UpdatedFrom);
                }
                if (search.UpdatedTo is not null)
                {
                    query = query.Where(f => f.UpdatedAt <= search.UpdatedTo);
                }
            }

            // Фільтрація сховища видалених файлів
            if (context.Role <= UserRole.Mod)
            {
                query = query.Where(f => f.IsDeleted == false);
            }

            var totalCount = await query.CountAsync(ct);
            var totalPages = (totalCount + pageSize - 1) / pageSize;

            var collection = await query
                .OrderBy(f => f.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Include(f => f.Author)
                .Include(f => f.Template)
                    .ThenInclude(t => t.TemplateType)
                .Include(f => f.Report)
                    .ThenInclude(r => r.Template)
                        .ThenInclude(t => t.TemplateType)
                .ToListAsync(ct);

            var result = _mapper.Map<List<GetFileEntityDTO>>(collection);

            var response = new PagedResponse<GetFileEntityDTO>(
                Items: result,
                CurrentPage: page,
                TotalCount: totalCount,
                TotalPages: totalPages);

            return response;
        }

        public async Task<PagedResponse<GetFileEntityDTO>> GetMyPageAsync(Guid userId, FileType ft, int page, int pageSize, CancellationToken ct = default)
        {
            var query = _unitOfWork.Files.AsQueryable();

            // Автор
            query = query.Where(f => f.AuthorId == userId);

            // Типізація
            if (ft == FileType.Template)
            {
                query = query.Where(f => f.Template != null);
            }
            else
            {
                query = query.Where(f => f.Report != null);
            }

            var totalCount = await query.CountAsync(ct);
            var totalPages = (totalCount + pageSize - 1) / pageSize;

            var collection = await query
                .OrderBy(f => f.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Include(f => f.Author)
                .Include(f => f.Template)
                    .ThenInclude(t => t.TemplateType)
                .Include(f => f.Report)
                    .ThenInclude(r => r.Template)
                        .ThenInclude(t => t.TemplateType)
                .ToListAsync(ct);

            var result = _mapper.Map<List<GetFileEntityDTO>>(collection);

            var response = new PagedResponse<GetFileEntityDTO>(
                Items: result,
                CurrentPage: page,
                TotalCount: totalCount,
                TotalPages: totalPages);

            return response;
        }

        private string GetDirectoryPath(Guid authorId, FileType ft, Guid entityId)
        {
            return $"{_basePath}\\{authorId}\\{ft}\\{entityId}.{_fileExtension}";
        }

        private async Task SaveToDiskAsync(Stream stream, string path, CancellationToken ct = default)
        {
            AppLogger.LogActionStarted(_logger, "збереження файлу");

            if (stream.CanSeek && stream.Position > 0)
            {
                stream.Seek(0, SeekOrigin.Begin);
            }

            var directory = Path.GetDirectoryName(path);
            if (!Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory!);
            }

            await using var fs = new FileStream(
                path,
                FileMode.Create,
                FileAccess.Write,
                FileShare.Write,
                bufferSize: 4096,
                useAsync: true);

            await stream.CopyToAsync(fs, ct);
            await fs.FlushAsync(ct);

            AppLogger.LogActionCompleted(_logger, "Збереження файлу");
        }
            
        public async Task<Stream> ReadFromFileAsync(string filePath, CancellationToken ct = default)
        {
            AppLogger.LogActionStarted(_logger, "читання з файлу");

            if (string.IsNullOrEmpty(filePath))
            {
                AppLogger.LogActionFailed(_logger, "читання з файлу");
                throw new BusinessException("Шлях до файлу не може бути порожнім");
            }

            if (!File.Exists(filePath))
            {
                AppLogger.LogActionFailed(_logger, "читання з файлу");
                throw new BusinessException("Файл не існує");
            }

            var stream = new FileStream(
                filePath,
                FileMode.Open,
                FileAccess.Read,
                FileShare.Read,
                bufferSize: 4096,
                useAsync: true);

            AppLogger.LogActionCompleted(_logger, "читання файлу");

            return stream;
        }
    
    }
}