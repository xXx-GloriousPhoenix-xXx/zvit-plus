using System.ComponentModel.DataAnnotations;

namespace ZvitPlus.BLL.DTOs.TemplateDTOs
{
    public sealed record CreateTemplateDTO(
        [Required] string Name,
        [Required] string Type,
        [Required] bool IsPrivate,
        [Required] Stream File
    );
}
