using ZvitPlus.BLL.Services.Enums;

namespace ZvitPlus.BLL.DTOs.FileDTOs
{
    public sealed record UpdateFileDTO(
        string? Name,
        bool? IsPrivate,
        Stream? File);
}
