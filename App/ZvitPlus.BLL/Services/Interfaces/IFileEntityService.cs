using ZvitPlus.BLL.Context;
using ZvitPlus.BLL.DTOs.AdditionalDTOs;
using ZvitPlus.BLL.DTOs.FileEntityDTOs;
using ZvitPlus.DAL.Models.Entities;

namespace ZvitPlus.BLL.Services.Interfaces
{
    public interface IFileEntityService
    {
        Task<GetFileEntityDTO> GetByIdAsync(Guid id, CancellationToken ct = default);
        Task<(FileEntity, Stream)> DownloadAsync(Guid id, CancellationToken ct = default);
        Task<PagedResponse<GetFileEntityDTO>> GetPageAsync(
            UserContext context,
            int page = 1,
            int pageSize = 10,
            SearchFileEntityDTO? search = null,
            CancellationToken ct = default);
        Task<PagedResponse<GetFileEntityDTO>> GetMyPageAsync(UserContext context, int page = 1, int pageSize = 10, CancellationToken ct = default);
        Task DeleteAsync(Guid id, UserContext context, CancellationToken ct = default);
    }
}
