namespace ZvitPlus.API.DTOs.ReportDTOs
{
    public sealed record UpdateReportDTORequest(
        string? Name,
        bool? IsPrivate,
        IFormFile? File
    );
}
