using System.Security.Claims;
using ZvitPlus.DAL.Models.Enums;

namespace ZvitPlus.API.Extensions.AuthorizationExtensions
{
    public static class ClaimsPrincipalExtensions
    {
        public static Guid GetUserId(this ClaimsPrincipal user)
        {
            var value = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (value is null)
            {
                throw new UnauthorizedAccessException("UserId claim missing");
            }

            return Guid.Parse(value);
        }

        public static UserRole GetRole(this ClaimsPrincipal user)
        {
            var value = user.FindFirst(ClaimTypes.Role)?.Value;
            if (value is null)
            {
                throw new UnauthorizedAccessException("Role claim missing");
            }

            return Enum.Parse<UserRole>(value);
        }
    }
}
