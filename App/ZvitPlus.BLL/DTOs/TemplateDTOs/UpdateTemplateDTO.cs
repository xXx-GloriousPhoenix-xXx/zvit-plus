namespace ZvitPlus.BLL.DTOs.TemplateDTOs
{
    public sealed record UpdateTemplateDTO(
        string? Name,
        string? TemplateType,
        bool? IsPrivate,
        string? FileBase64
    );
}
