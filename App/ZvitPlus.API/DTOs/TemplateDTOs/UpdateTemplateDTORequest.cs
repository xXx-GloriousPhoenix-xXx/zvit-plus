namespace ZvitPlus.API.DTOs.TemplateDTOs
{
    public sealed record UpdateTemplateDTORequest(
        string? Name,
        string? TemplateType,
        bool? IsPrivate,
        IFormFile? File
    );
}
