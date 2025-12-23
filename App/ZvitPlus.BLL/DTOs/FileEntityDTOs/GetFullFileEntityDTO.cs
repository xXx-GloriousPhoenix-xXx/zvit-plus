using ZvitPlus.BLL.DTOs.FileDTOs;

namespace ZvitPlus.BLL.DTOs.FileEntityDTOs
{
    public sealed record GetFullFileEntityDTO(
        Guid Id,
        string Name,
        string Author,
        string TemplateType,
        bool IsPrivate,
        int FileSize,
        DateTime CreatedAt,
        DateTime UpdatedAt,
        FileData File
    );
}
