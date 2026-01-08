namespace ZvitPlus.BLL.DTOs.TemplateDTOs
{
    public sealed record CreateTemplateDTO(
        string Name,
        Guid TypeId,
        bool IsPrivate,
        Stream File
    );
}
