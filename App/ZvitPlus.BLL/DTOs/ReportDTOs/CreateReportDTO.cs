using System.ComponentModel.DataAnnotations;

namespace ZvitPlus.BLL.DTOs.ReportDTOs
{
    public sealed record CreateReportDTO(
        [property: Required]
        string Name,
        [property: Required]
        Guid AuthorId,
        [property: Required]
        Guid TemplateId,
        [property: Required]
        bool IsPrivate,
        [property: Required]
        string FileBase64
    );
}
