namespace ZvitPlus.API.DTOs.ReportDTOs
{
    public sealed record UpdateReportDTORequest(
        string? Name,
        Guid? TemplateId,
        bool? IsPrivate,
        IFormFile? File
    );
}
