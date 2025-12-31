namespace ZvitPlus.BLL.DTOs.TemplateDTOs
{
    public sealed record CreateTemplateDTO(
        string Name,
        string Type,
        bool IsPrivate,
        Stream File
    );
}
