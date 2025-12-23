using ZvitPlus.BLL.DTOs.FileDTOs;
using ZvitPlus.BLL.Services.Enums;

namespace ZvitPlus.BLL.Services.Interfaces
{

    public interface IFileService
    {
        Task<string> SaveFileAsync(
            FileContent file, 
            FileType ft,
            Guid entityId, 
            Guid authorId, 
            CancellationToken ct = default);
        Task<FileContent> GetFileAsync(
            FileType ft, 
            Guid entityId, 
            CancellationToken ct = default);
        Task DeleteFileAsync(
            FileType ft, 
            Guid entityId, 
            CancellationToken ct = default);
    }
}
