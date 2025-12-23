namespace ZvitPlus.BLL.DTOs.FileDTOs
{
    public sealed record FileData(
        byte[] Data,
        string FileName,
        string ContentType
    );
}
