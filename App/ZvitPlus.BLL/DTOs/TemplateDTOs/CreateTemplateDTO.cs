using System.ComponentModel.DataAnnotations;

namespace ZvitPlus.BLL.DTOs.TemplateDTOs
{
    public sealed record CreateTemplateDTO(
        [property: Required]
        string Name,
        [property: Required]
        Guid AuthorId,
        [property: Required]
        string TemplateType,
        [property: Required]
        bool IsPrivate,
        [property: Required]
        string FileBase64
    );
}
