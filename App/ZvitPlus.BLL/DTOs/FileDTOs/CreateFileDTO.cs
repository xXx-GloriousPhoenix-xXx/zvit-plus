using ZvitPlus.BLL.Services.Enums;

namespace ZvitPlus.BLL.DTOs.FileDTOs
{
    public sealed record CreateFileDTO(
        string Name,
        FileType Type,
        bool IsPrivate,
        Stream File
    );
}
