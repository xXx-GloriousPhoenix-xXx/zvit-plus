namespace ZvitPlus.BLL.DTOs.AuthDTOs
{
    public sealed record TokenDTO(
        string AccessToken,
        string RefreshToken,
        int ExpiresIn
    );
}
