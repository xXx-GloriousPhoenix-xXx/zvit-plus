using ZvitPlus.DAL.Models.Enums;

namespace ZvitPlus.BLL.DTOs.AuthDTOs
{
    public sealed record TokenDTO(
        string AccessToken,
        string RefreshToken,
        int ExpiresIn,
        UserRole Role
    );
}
