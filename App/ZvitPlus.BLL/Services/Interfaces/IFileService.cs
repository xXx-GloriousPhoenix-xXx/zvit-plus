using ZvitPlus.BLL.Context;
using ZvitPlus.BLL.DTOs.AdditionalDTOs;
using ZvitPlus.BLL.DTOs.FileDTOs;
using ZvitPlus.BLL.DTOs.FileEntityDTOs;
using ZvitPlus.BLL.Services.Enums;
using ZvitPlus.DAL.Models.Entities;

namespace ZvitPlus.BLL.Services.Interfaces
{
    public interface IFileService
    {
        Task<(Guid fileId, string filePath)> AddAsync(CreateFileDTO dto, Guid authorId, CancellationToken ct = default);
        Task<FileEntity> UpdateAsync(Guid entityId, UpdateFileDTO dto, CancellationToken ct = default);
        Task<GetFileEntityDTO?> GetByIdAsync(Guid entityId, CancellationToken ct = default);
        Task<(FileEntity entity, Stream stream)?> GetWithStreamAsync(Guid entityId, CancellationToken ct = default);
        Task<bool> ExistsAsync(Guid entityId, CancellationToken ct = default);
        Task ForceDeleteAsync(Guid entityId, CancellationToken ct = default);
        Task DeleteAsync(Guid entityId, UserContext context, CancellationToken ct = default);
        Task RestoreAsync(Guid entityId, CancellationToken ct = default);
        Task<PagedResponse<GetFileEntityDTO>> GetPageAsync(
            UserContext context,
            FileType ft,
            int page = 1,
            int pageSize = 10, 
            SearchFileEntityDTO? search = null,
            CancellationToken ct = default);
    }
}
