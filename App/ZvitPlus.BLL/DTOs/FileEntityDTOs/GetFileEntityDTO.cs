namespace ZvitPlus.BLL.DTOs.FileEntityDTOs
{
    public sealed record GetFileEntityDTO(
        Guid Id,
        string Name,
        string Author,
        string TemplateType,
        bool IsPrivate,
        Guid FileId,
        long FileSize,
        DateTime CreatedAt,
        DateTime UpdatedAt
    );
}
