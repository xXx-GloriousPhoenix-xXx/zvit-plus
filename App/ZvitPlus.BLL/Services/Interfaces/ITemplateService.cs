using ZvitPlus.BLL.DTOs.FileDTOs;
using ZvitPlus.BLL.DTOs.FileEntityDTOs;
using ZvitPlus.BLL.DTOs.TemplateDTOs;

namespace ZvitPlus.BLL.Services.Interfaces
{
    public interface ITemplateService : IFileEntityService
    {
        Task<GetFileEntityDTO> AddAsync(CreateTemplateDTO dto, CancellationToken ct = default);
        Task<GetFileEntityDTO> UpdateAsync(Guid id, UpdateTemplateDTO dto, CancellationToken ct = default);
    }
}
