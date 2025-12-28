using System.ComponentModel.DataAnnotations;

namespace ZvitPlus.API.DTOs.TemplateDTOs
{
    public sealed record CreateTemplateDTORequest
    (
        [property: Required]
        string Name,
        [property: Required]
        string TemplateType,
        [property: Required]
        bool IsPrivate,
        [property: Required]
        IFormFile File
    );
}
