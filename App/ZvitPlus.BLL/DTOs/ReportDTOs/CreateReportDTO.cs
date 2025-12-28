using System.ComponentModel.DataAnnotations;

namespace ZvitPlus.BLL.DTOs.ReportDTOs
{
    public sealed record CreateReportDTO(
        [Required] string Name,
        [Required] Guid AuthorId,
        [Required] Guid TemplateId,
        [Required] bool IsPrivate,
        [Required] Stream File
    );
}
