using ZvitPlus.BLL.DTOs.TemplateTypeDTO;

namespace ZvitPlus.BLL.Services.Interfaces
{
    public interface ITemplateTypeService
    {
        Task<IEnumerable<GetTemplateTypeDTO>> GetAllAsync(CancellationToken ct = default);
    }
}
