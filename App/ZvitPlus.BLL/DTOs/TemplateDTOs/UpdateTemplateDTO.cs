namespace ZvitPlus.BLL.DTOs.TemplateDTOs
{
    public sealed record UpdateTemplateDTO(
        string? Name,
        string? Type,
        bool? IsPrivate,
        Stream? File
    );
}
