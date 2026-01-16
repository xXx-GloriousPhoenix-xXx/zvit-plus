using AutoMapper;
using Microsoft.Extensions.Logging;
using ZvitPlus.BLL.Context;
using ZvitPlus.BLL.DTOs.AdditionalDTOs;
using ZvitPlus.BLL.DTOs.FileDTOs;
using ZvitPlus.BLL.DTOs.FileEntityDTOs;
using ZvitPlus.BLL.DTOs.TemplateDTOs;
using ZvitPlus.BLL.Services.Exceptions;
using ZvitPlus.BLL.Services.Interfaces;
using ZvitPlus.BLL.Services.Logging;
using ZvitPlus.DAL.Models.Entities;
using ZvitPlus.DAL.Repositories.Interfaces;
using ZvitPlus.BLL.Services.Enums;

namespace ZvitPlus.BLL.Services.Implementations
{
    public class TemplateService(IUnitOfWork unitOfWork, IMapper mapper, ILogger<TemplateService> logger, IFileService fileService) : ITemplateService
    {
        private readonly IUnitOfWork _unitOfWork = unitOfWork;
        private readonly IMapper _mapper = mapper;
        private readonly ILogger<TemplateService> _logger = logger;
        private readonly IFileService _fileService = fileService;

        public async Task<GetFileEntityDTO> AddAsync(CreateTemplateDTO dto, UserContext context, CancellationToken ct = default)
        {
            string? createdFilePath = null;
            Template? entity;

            // Створення запису шаблону
            await _unitOfWork.BeginTransactionAsync(ct);
            try
            {
                // Делегувати створення файловому сервісу; Отримати id запису файлу
                var innerDto = _mapper.Map<CreateFileDTO>(dto);
                var (fileId, filePath) = await _fileService.AddAsync(innerDto, context.UserId, ct);

                createdFilePath = filePath;

                // Знайти тип шаблону
                AppLogger.LogActionStarted(_logger, "пошук шаблону");

                //
                Console.WriteLine($"In Service: {dto.TypeId}");
                foreach (var type in await _unitOfWork.TemplateTypes.GetAllAsync(ct))
                {
                    Console.WriteLine(type.Id);
                }

                var templateType = await _unitOfWork.TemplateTypes.GetByIdAsync(dto.TypeId, ct);
                if (templateType is null)
                {
                    AppLogger.LogActionFailed(_logger, "пошуку типу шаблона");
                    throw new BusinessException("Тип шаблону не знайдено");
                }

                // Створити об'єкт шаблону
                AppLogger.LogActionStarted(_logger, "збереження шаблону");
                entity = new Template()
                {
                    Id = Guid.NewGuid(),
                    TemplateTypeId = templateType.Id,
                    FileId = fileId
                };

                _unitOfWork.Templates.Add(entity);
                await _unitOfWork.CompleteAsync(ct);
                await _unitOfWork.CommitTransactionAsync(ct);
                AppLogger.LogActionCompleted(_logger, "Збереження шаблону", entity.Id);
            }
            catch
            {
                await _unitOfWork.RollbackTransactionAsync(ct);

                if (createdFilePath is not null && File.Exists(createdFilePath))
                {
                    File.Delete(createdFilePath);

                    var dir = Path.GetDirectoryName(createdFilePath)!;
                    if (Directory.Exists(dir) && !Directory.EnumerateFileSystemEntries(dir).Any())
                    {
                        Directory.Delete(dir);
                    }
                }

                AppLogger.LogActionFailed(_logger, "збереження шаблону");
                throw new BusinessException("Помилка збереження шаблону");
            }

            // Повернення інформації про запис
            var response = await _fileService.GetByIdAsync(entity.FileId, ct);
            if (response is null)
            {
                throw new BusinessException("Помилка формування інформації про файл");
            }

            return response;
        }

        public async Task DeleteAsync(Guid id, UserContext context, CancellationToken ct = default)
        {
            AppLogger.LogActionStarted(_logger, "видалення шаблону", id);

            // Знайти запис шаблону
            var entity = await _unitOfWork.Templates.GetByIdAsync(id, ct);
            if (entity is null)
            {
                AppLogger.LogActionFailed(_logger, "видалення шаблону");
                throw new BusinessException("Шаблон не знайдено");
            }

            id = entity.FileId;

            await _unitOfWork.BeginTransactionAsync(ct);
            try
            {
                // Делегація видалення файловому сервісу
                await _fileService.DeleteAsync(id, context, ct);

                // Видалення запису про шаблон
                _unitOfWork.Templates.Delete(entity);
                await _unitOfWork.CompleteAsync(ct);
                await _unitOfWork.CommitTransactionAsync(ct);
                AppLogger.LogActionCompleted(_logger, "Видалення шаблону", id);
            }
            catch
            {
                await _unitOfWork.RollbackTransactionAsync(ct);
                AppLogger.LogActionFailed(_logger, "видалення шаблону", id);
                throw new BusinessException("Помилка видалення шаблону");
            }
        }

        public async Task<GetFileEntityDTO> GetByIdAsync(Guid id, CancellationToken ct = default)
        {
            AppLogger.LogActionStarted(_logger, "читання шаблону", id);

            // Отримуємо запис про файл
            var entity = await _unitOfWork.Templates.GetByIdAsync(id, ct);
            if (entity is null)
            {
                AppLogger.LogActionFailed(_logger, "читання шаблону", id);
                throw new BusinessException("Шаблон не знайдено");
            }

            // Отримуємо неповну DTO файлу
            var fileEntityDto = await _fileService.GetByIdAsync(entity.FileId, ct);
            if (fileEntityDto is null)
            {
                AppLogger.LogActionFailed(_logger, "читання шаблону", id);
                throw new BusinessException("Не вдалося сформувати початкову DTO файлу");
            }

            AppLogger.LogActionCompleted(_logger, "Читання шаблону", id);

            return fileEntityDto;
        }

        public async Task<PagedResponse<GetFileEntityDTO>> GetPageAsync(UserContext context, int page = 1, int pageSize = 10, SearchFileEntityDTO? search = null, CancellationToken ct = default)
        {
            if (page < 1)
            {
                page = 1;
            }
            if (pageSize < 2)
            {
                pageSize = 10;
            }
            else if (pageSize > 50)
            {
                pageSize = 50;
            }

            var response = await _fileService.GetPageAsync(context, FileType.Template, page, pageSize, search, ct);
            return response;
        }

        public async Task<PagedResponse<GetFileEntityDTO>> GetMyPageAsync(UserContext context, int page = 1, int pageSize = 10, CancellationToken ct = default)
        {
            if (page < 1)
            {
                page = 1;
            }
            if (pageSize < 2)
            {
                pageSize = 10;
            }

            var response = await _fileService.GetMyPageAsync(context.UserId, FileType.Template, page, pageSize, ct);
            return response;
        }

        public async Task<GetFileEntityDTO> UpdateAsync(Guid id, UpdateTemplateDTO dto, UserContext context, CancellationToken ct = default)
        {
            AppLogger.LogActionStarted(_logger, "оновлення шаблону", id);

            // Отримуємо запис про шаблон
            var entity = await _unitOfWork.Templates.GetByIdAsync(id, ct);
            if (entity is null)
            {
                AppLogger.LogActionFailed(_logger, "оновлення шаблону", id);
                throw new BusinessException("Шаблон не знайдено");
            }

            var currentFileEntity = await _unitOfWork.Files.GetByIdAsync(entity.FileId, ct);
            string? fileBackupPath = null;

            await _unitOfWork.BeginTransactionAsync(ct);
            try
            {
                // Якщо оновлюється файл - делегація процесу у файловий сервіс
                if (dto.File is not null)
                {
                    var innerDto = _mapper.Map<UpdateFileDTO>(dto);

                    if (currentFileEntity != null && File.Exists(currentFileEntity.FilePath))
                    {
                        fileBackupPath = currentFileEntity.FilePath + ".backup";
                        File.Copy(currentFileEntity.FilePath, fileBackupPath, true);
                    }

                    await _fileService.UpdateAsync(entity.FileId, innerDto, ct);
                }

                // Оновлення запису БД
                if (dto.Type is not null)
                {
                    var templateTypes = await _unitOfWork.TemplateTypes.FindAsync(tt => tt.Name == dto.Type, ct);
                    var type = templateTypes.SingleOrDefault();
                    if (type is null)
                    {
                        throw new BusinessException("Тип шаблону не знайдено");
                    }

                    entity.TemplateTypeId = type.Id;
                }

                _unitOfWork.Templates.Update(entity);
                await _unitOfWork.CompleteAsync(ct);
                await _unitOfWork.CommitTransactionAsync(ct);
                AppLogger.LogActionCompleted(_logger, "Оновлення шаблону", id);
            }
            catch
            {
                await _unitOfWork.RollbackTransactionAsync(ct);

                if (fileBackupPath is not null && currentFileEntity != null)
                {
                    try
                    {
                        if (File.Exists(currentFileEntity.FilePath))
                        {
                            File.Delete(currentFileEntity.FilePath);
                        }
                        if (File.Exists(fileBackupPath))
                        {
                            File.Move(fileBackupPath, currentFileEntity.FilePath);
                        }
                    }
                    catch (Exception rollbackEx)
                    {
                        _logger.LogError(rollbackEx, "Помилка під час відкату файлу");
                    }
                }

                AppLogger.LogActionFailed(_logger, "оновелння шаблону", id);
                throw new BusinessException("Помилка оновлення шаблону");
            }
            finally
            {
                if (fileBackupPath is not null && File.Exists(fileBackupPath))
                {
                    try { File.Delete(fileBackupPath); } catch { }
                }
            }

            AppLogger.LogActionStarted(_logger, "читання шаблону", id);

            var response = await _fileService.GetByIdAsync(entity.FileId, ct);
            if (response is null)
            {
                AppLogger.LogActionFailed(_logger, "читання шаблону", id);
                throw new BusinessException("Помилка читання шаблону");
            }

            AppLogger.LogActionCompleted(_logger, "Читання шаблону", id);

            return response;
        }

        public async Task<(FileEntity, Stream)> DownloadAsync(Guid id, CancellationToken ct = default)
        {
            var template = await _unitOfWork.Templates.GetByIdAsync(id, ct, t => t.File);
            var file = template!.File;
            var path = file!.FilePath;
            var stream = await _fileService.ReadFromFileAsync(path, ct);
            return (file, stream);
        }
    }
}
