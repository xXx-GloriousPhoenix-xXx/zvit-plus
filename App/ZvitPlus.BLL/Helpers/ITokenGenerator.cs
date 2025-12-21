using ZvitPlus.BLL.DTOs.AuthDTOs;
using ZvitPlus.DAL.Models.Entities;

namespace ZvitPlus.BLL.Helpers
{
    public interface ITokenGenerator
    {
        string GenerateAccessToken(User user);
        string GenerateRefreshToken();
        int AccessExpiresInMinutes { get; }
        int RefreshExpiresInDays { get; }
    }
}
