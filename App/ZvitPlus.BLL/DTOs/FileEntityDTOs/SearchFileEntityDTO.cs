namespace ZvitPlus.BLL.DTOs.FileEntityDTOs
{
    public record SearchFileEntityDTO(
        string? Name,
        string? Author,
        string? TemplateType,
        DateTime? CreatedFrom,
        DateTime? CreatedTo,
        DateTime? UpdatedFrom,
        DateTime? UpdatedTo
    );
}
