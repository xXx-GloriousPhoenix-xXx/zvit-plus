using System.ComponentModel.DataAnnotations;

namespace ZvitPlus.API.DTOs.TemplateDTOs
{
    public sealed class CreateTemplateDTORequest
    {
        [Required] public required string Name { get; init; }
        [Required] public required Guid TemplateTypeId { get; init; }
        [Required] public required bool IsPrivate { get; init; }
        [Required] public required IFormFile File { get; init; }
    }
}
