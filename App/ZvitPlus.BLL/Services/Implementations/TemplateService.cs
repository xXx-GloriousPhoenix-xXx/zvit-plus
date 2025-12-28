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
            // Делегувати створення файловому сервісу; Отримати id запису файлу
            var innerDto = _mapper.Map<CreateFileDTO>(dto);
            var fileId = await _fileService.AddAsync(innerDto, context.UserId, ct);

            // Знайти тип шаблону
            AppLogger.LogActionStarted(_logger, "пошук шаблону");

            var templateTypes = await _unitOfWork.TemplateTypes.FindAsync(t => t.Name == dto.Type, ct);
            var templateType = templateTypes.SingleOrDefault();
            if (templateType is null)
            {
                AppLogger.LogActionFailed(_logger, "пошуку типу шаблона");
                throw new BusinessException("Тип шаблону не знайдено");
            }

            // Створити об'єкт шаблону
            AppLogger.LogActionStarted(_logger, "збереження шаблону");
            var entityId = Guid.NewGuid();
            var entity = new Template()
            {
                Id = entityId,
                TemplateTypeId = templateType.Id,
                FileId = fileId
            };

            // Створення запису шаблону
            await _unitOfWork.BeginTransactionAsync(ct);
            try
            {
                _unitOfWork.Templates.Add(entity);
                await _unitOfWork.CompleteAsync(ct);
                await _unitOfWork.CommitTransactionAsync(ct);
                AppLogger.LogActionCompleted(_logger, "Збереження шаблону", entityId);
            }
            catch
            {
                await _unitOfWork.RollbackTransactionAsync(ct);
                AppLogger.LogActionFailed(_logger, "збереження шаблону");
                throw new BusinessException("Помилка збереження шаблону");
            }

            // Повернення інформації про запис
            var createdEntity = await _unitOfWork.Templates.GetByIdAsync(entityId, ct);
            var createdDto = _mapper.Map<GetFileEntityDTO>(createdEntity);
            return createdDto;
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

            // Делегація видалення файловому сервісу
            await _fileService.DeleteAsync(id, context, ct);

            // Видалення запису про шаблон
            await _unitOfWork.BeginTransactionAsync(ct);
            try
            {
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

        public async Task<GetFullFileEntityDTO> GetByIdAsync(Guid id, CancellationToken ct = default)
        {
            AppLogger.LogActionStarted(_logger, "читання шаблону", id);

            // Отримуємо запис про файл
            var entity = await _unitOfWork.Templates.GetByIdAsync(id, ct);
            if (entity is null)
            {
                AppLogger.LogActionFailed(_logger, "читання шаблону", id);
                throw new BusinessException("Шаблон не знайдено");
            }

            // Отримуємо файл з системи
            var result = await _fileService.GetWithStreamAsync(entity.FileId, ct);
            if (result is null)
            {
                AppLogger.LogActionFailed(_logger, "читання шаблону", id);
                throw new BusinessException("Файл не знайдено");
            }
            var fileStream = result.Value.stream;

            // Отримуємо неповну DTO файлу
            var fileEntityDto = await _fileService.GetByIdAsync(entity.FileId, ct);
            if (fileEntityDto is null)
            {
                AppLogger.LogActionFailed(_logger, "читання шаблону", id);
                throw new BusinessException("Не вдалося сформувати початкову DTO файлу");
            }

            // Будуємо DTO
            var dto = new GetFullFileEntityDTO(
                Meta: fileEntityDto,
                File: fileStream
                );

            AppLogger.LogActionCompleted(_logger, "Читання шаблону", id);

            return dto;
        }

        public async Task<PagedResponse<GetFileEntityDTO>> GetPageAsync(
            UserContext context,
            int page = 1,
            int pageSize = 10,
            SearchFileEntityDTO? search = null,
            CancellationToken ct = default)
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

            // Якщо оновлюється файл - делегація процесу у файловий сервіс
            if (dto.File is not null)
            {
                var innerDto = _mapper.Map<UpdateFileDTO>(dto);
                await _fileService.UpdateAsync(entity.FileId, innerDto, ct);
            }

            // Оновлення запису БД
            if (dto.Type is not null)
            {
                var singleItemCollection = await _unitOfWork.TemplateTypes.FindAsync(tt => tt.Name == dto.Type, ct);
                try
                {
                    var type = singleItemCollection.SingleOrDefault();
                    if (type is null)
                    {
                        throw new BusinessException("Тип шаблону не знайдено");
                    }

                    entity.TemplateTypeId = type.Id;
                }
                catch
                {
                    AppLogger.LogActionFailed(_logger, "оновлення файлу", id);
                    throw;
                }
            }

            await _unitOfWork.BeginTransactionAsync(ct);
            try
            {
                _unitOfWork.Templates.Update(entity);
                await _unitOfWork.CompleteAsync(ct);
                await _unitOfWork.CommitTransactionAsync(ct);
                AppLogger.LogActionCompleted(_logger, "Оновлення шаблону", id);
            }
            catch
            {
                await _unitOfWork.RollbackTransactionAsync(ct);
                AppLogger.LogActionFailed(_logger, "оновелння шаблону", id);
                throw new BusinessException("Помилка оновлення шаблону");
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
    }
}
