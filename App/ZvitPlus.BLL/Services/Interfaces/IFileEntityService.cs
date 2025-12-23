using ZvitPlus.BLL.DTOs.AdditionalDTOs;
using ZvitPlus.BLL.DTOs.FileDTOs;
using ZvitPlus.BLL.DTOs.FileEntityDTOs;

namespace ZvitPlus.BLL.Services.Interfaces
{
    public interface IFileEntityService
    {
        Task<GetFullFileEntityDTO> GetByIdAsync(Guid id, CancellationToken ct = default);
        Task<PagedResponse<GetFileEntityDTO>> GetPageAsync(
            int page,
            int pageSize,
            SearchFileEntityDTO? search,
            CancellationToken ct = default);
        Task DeleteAsync(Guid id, CancellationToken ct = default);
    }
}
