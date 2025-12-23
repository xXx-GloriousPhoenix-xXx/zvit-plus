using ZvitPlus.BLL.DTOs.FileDTOs;

namespace ZvitPlus.BLL.DTOs.ReportDTOs
{
    public sealed record UpdateReportDTO(
        string? Name,
        bool? IsPrivate,
        string? FileBase64
    );
}
