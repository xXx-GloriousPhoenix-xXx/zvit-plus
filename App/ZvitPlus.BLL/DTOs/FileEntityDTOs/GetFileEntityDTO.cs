namespace ZvitPlus.BLL.DTOs.FileEntityDTOs
{
    public sealed record GetFileEntityDTO(
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
