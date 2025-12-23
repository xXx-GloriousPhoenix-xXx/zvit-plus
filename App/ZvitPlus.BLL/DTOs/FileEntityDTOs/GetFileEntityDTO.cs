namespace ZvitPlus.BLL.DTOs.FileEntityDTOs
{
    public sealed record GetFileEntityDTO(
        Guid Id,
        string Name,
        string Author,
        string TemplateType,
        bool IsPrivate,
        int FileSize,
        DateTime CreatedAt,
        DateTime UpdatedAt
    );
}
