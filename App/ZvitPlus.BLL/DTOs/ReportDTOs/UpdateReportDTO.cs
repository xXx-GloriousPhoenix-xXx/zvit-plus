namespace ZvitPlus.BLL.DTOs.ReportDTOs
{
    public sealed record UpdateReportDTO(
        string? Name,
        bool? IsPrivate,
        Stream? File
    );
}
