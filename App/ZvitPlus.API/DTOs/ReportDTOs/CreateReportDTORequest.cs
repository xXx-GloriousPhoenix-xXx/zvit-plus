using System.ComponentModel.DataAnnotations;

namespace ZvitPlus.API.DTOs.ReportDTOs
{
    public sealed class CreateReportDTORequest
    {
        [Required] public required string Name { get; init; }
        [Required] public required Guid TemplateId { get; init; }
        [Required] public required bool IsPrivate { get; init; }
        [Required] public required IFormFile File { get; init; }
    }
}
