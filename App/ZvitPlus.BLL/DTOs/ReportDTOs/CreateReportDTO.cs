namespace ZvitPlus.BLL.DTOs.ReportDTOs
{
    public sealed record CreateReportDTO(
        string Name,
        Guid TemplateId,
        bool IsPrivate,
        Stream File
    );
}
