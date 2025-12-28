using ZvitPlus.BLL.Context;
using ZvitPlus.BLL.DTOs.FileEntityDTOs;
using ZvitPlus.BLL.DTOs.TemplateDTOs;

namespace ZvitPlus.BLL.Services.Interfaces
{
    public interface ITemplateService : IFileEntityService
    {
        Task<GetFileEntityDTO> AddAsync(CreateTemplateDTO dto, UserContext context, CancellationToken ct = default);
        Task<GetFileEntityDTO> UpdateAsync(Guid id, UpdateTemplateDTO dto, UserContext context, CancellationToken ct = default);
    }
}
