namespace ZvitPlus.BLL.DTOs.FileDTOs
{
    public sealed record FileContent(
        Stream Content,
        string FileName,
        string ContentType
    );
}
