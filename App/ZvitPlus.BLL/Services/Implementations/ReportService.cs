using AutoMapper;
using Microsoft.Extensions.Logging;
using ZvitPlus.BLL.Context;
using ZvitPlus.BLL.DTOs.AdditionalDTOs;
using ZvitPlus.BLL.DTOs.FileDTOs;
using ZvitPlus.BLL.DTOs.FileEntityDTOs;
using ZvitPlus.BLL.DTOs.ReportDTOs;
using ZvitPlus.BLL.Services.Exceptions;
using ZvitPlus.BLL.Services.Interfaces;
using ZvitPlus.BLL.Services.Logging;
using ZvitPlus.DAL.Models.Entities;
using ZvitPlus.DAL.Repositories.Interfaces;

namespace ZvitPlus.BLL.Services.Implementations
{
    public class ReportService(IUnitOfWork unitOfWork, IMapper mapper, ILogger<ReportService> logger, IFileService fileService) : IReportService
    {
        private readonly IUnitOfWork _unitOfWork = unitOfWork;
        private readonly IMapper _mapper = mapper;
        private readonly ILogger<ReportService> _logger = logger;
        private readonly IFileService _fileService = fileService;

        public async Task<GetFileEntityDTO> AddAsync(CreateReportDTO dto, UserContext context, CancellationToken ct = default)
        {
            // Делегувати створення файловому сервісу; Отримати id запису файлу
            var innerDto = _mapper.Map<CreateFileDTO>(dto);
            var fileId = await _fileService.AddAsync(innerDto, context.UserId, ct);

            // Створити об'єкт звіту
            AppLogger.LogActionStarted(_logger, "збереження звіту");
            var entityId = Guid.NewGuid();
            var entity = new Report()
            {
                Id = entityId,
                TemplateId = dto.TemplateId,
                FileId = fileId
            };

            // Створення запису звіту
            await _unitOfWork.BeginTransactionAsync(ct);
            try
            {
                _unitOfWork.Reports.Add(entity);
                await _unitOfWork.CompleteAsync(ct);
                await _unitOfWork.CommitTransactionAsync(ct);
                AppLogger.LogActionCompleted(_logger, "Збереження звіту", entityId);
            }
            catch
            {
                await _unitOfWork.RollbackTransactionAsync(ct);
                AppLogger.LogActionFailed(_logger, "збереження звіту");
                throw new BusinessException("Помилка збереження звіту");
            }

            // Повернення інформації про запис
            var createdEntity = await _unitOfWork.Reports.GetByIdAsync(entityId, ct);
            var createdDto = _mapper.Map<GetFileEntityDTO>(createdEntity);
            return createdDto;
        }

        public async Task DeleteAsync(Guid id, UserContext context, CancellationToken ct = default)
        {
            AppLogger.LogActionStarted(_logger, "видалення звіту", id);

            // Знайти запис звіту
            var entity = await _unitOfWork.Reports.GetByIdAsync(id, ct);
            if (entity is null)
            {
                AppLogger.LogActionFailed(_logger, "видалення звіту");
                throw new BusinessException("Звіт не знайдено");
            }

            // Делегація видалення файловому сервісу
            await _fileService.DeleteAsync(id, context, ct);

            // Видалення запису про звіт
            await _unitOfWork.BeginTransactionAsync(ct);
            try
            {
                _unitOfWork.Reports.Delete(entity);
                await _unitOfWork.CompleteAsync(ct);
                await _unitOfWork.CommitTransactionAsync(ct);
                AppLogger.LogActionCompleted(_logger, "Видалення звіту", id);
            }
            catch
            {
                await _unitOfWork.RollbackTransactionAsync(ct);
                AppLogger.LogActionFailed(_logger, "видалення звіту", id);
                throw new BusinessException("Помилка видалення звіту");
            }
        }

        public async Task<GetFullFileEntityDTO> GetByIdAsync(Guid id, CancellationToken ct = default)
        {
            AppLogger.LogActionStarted(_logger, "читання звіту", id);

            // Отримуємо запис про файл
            var entity = await _unitOfWork.Reports.GetByIdAsync(id, ct);
            if (entity is null)
            {
                AppLogger.LogActionFailed(_logger, "читання звіту", id);
                throw new BusinessException("Звіт не знайдено");
            }

            // Отримуємо файл з системи
            var result = await _fileService.GetWithStreamAsync(entity.FileId, ct);
            if (result is null)
            {
                AppLogger.LogActionFailed(_logger, "читання звіту", id);
                throw new BusinessException("Файл не знайдено");
            }
            var fileStream = result.Value.stream;

            // Отримуємо неповну DTO файлу
            var fileEntityDto = await _fileService.GetByIdAsync(entity.FileId, ct);
            if (fileEntityDto is null)
            {
                AppLogger.LogActionFailed(_logger, "читання звіту", id);
                throw new BusinessException("Не вдалося сформувати початкову DTO файлу");
            }

            // Будуємо DTO
            var dto = new GetFullFileEntityDTO(
                Meta: fileEntityDto,
                File: fileStream
                );

            AppLogger.LogActionCompleted(_logger, "Читання звіту", id);

            return dto;
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

            var response = await _fileService.GetPageAsync(context, page, pageSize, search, ct);
            return response;
        }

        public async Task<GetFileEntityDTO> UpdateAsync(Guid id, UpdateReportDTO dto, UserContext context, CancellationToken ct = default)
        {
            AppLogger.LogActionStarted(_logger, "оновлення звіту", id);

            // Отримуємо запис про звіт
            var entity = await _unitOfWork.Reports.GetByIdAsync(id, ct);
            if (entity is null)
            {
                AppLogger.LogActionFailed(_logger, "оновлення звіту", id);
                throw new BusinessException("Звіт не знайдено");
            }

            // Якщо оновлюється файл - делегація процесу у файловий сервіс
            if (dto.File is not null)
            {
                var innerDto = _mapper.Map<UpdateFileDTO>(dto);
                await _fileService.UpdateAsync(entity.FileId, innerDto, ct);
            }

            await _unitOfWork.BeginTransactionAsync(ct);
            try
            {
                _unitOfWork.Reports.Update(entity);
                await _unitOfWork.CompleteAsync(ct);
                await _unitOfWork.CommitTransactionAsync(ct);
                AppLogger.LogActionCompleted(_logger, "Оновлення звіту", id);
            }
            catch
            {
                await _unitOfWork.RollbackTransactionAsync(ct);
                AppLogger.LogActionFailed(_logger, "оновелння звіту", id);
                throw new BusinessException("Помилка оновлення звіту");
            }

            AppLogger.LogActionStarted(_logger, "читання звіту", id);

            var response = await _fileService.GetByIdAsync(entity.FileId, ct);
            if (response is null)
            {
                AppLogger.LogActionFailed(_logger, "читання звіту", id);
                throw new BusinessException("Помилка читання звіту");
            }

            AppLogger.LogActionCompleted(_logger, "Читання звіту", id);

            return response;
        }
    }
}
