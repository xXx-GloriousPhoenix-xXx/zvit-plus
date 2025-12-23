using ZvitPlus.BLL.DTOs.FileDTOs;
using ZvitPlus.BLL.Services.Enums;
using ZvitPlus.BLL.Services.Interfaces;

namespace ZvitPlus.BLL.Services.Implementations
{
    public class FileService : IFileService
    {
        public Task<string> SaveFileAsync(FileContent file, FileType ft, Guid entityId, Guid authorId, CancellationToken ct = default)
        {
            throw new NotImplementedException();
        }

        public Task<FileContent> GetFileAsync(FileType ft, Guid entityId, CancellationToken ct = default)
        {
            throw new NotImplementedException();
        }

        public Task DeleteFileAsync(FileType ft, Guid entityId, CancellationToken ct = default)
        {
            throw new NotImplementedException();
        }
    }
}
