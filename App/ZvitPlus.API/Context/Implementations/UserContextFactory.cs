using System.Security.Claims;
using ZvitPlus.BLL.Context;
using ZvitPlus.API.Context.Interfaces;
using ZvitPlus.DAL.Models.Enums;

namespace ZvitPlus.API.Context.Implementations
{
    public class UserContextFactory(IHttpContextAccessor httpContextAccessor) : IUserContextFactory
    {
        private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;
        public UserContext CreateUserContext()
        {
            var httpContext = _httpContextAccessor.HttpContext;

            if (httpContext?.User?.Identity?.IsAuthenticated != true)
            {
                return CreateGuestContext();
            }

            var user = httpContext.User;
            var userId = GetUserId(user);
            var role = GetUserRole(user);

            return new UserContext(userId, role, true);
        }

        public UserContext CreateGuestContext()
        {
            return new UserContext(Guid.Empty, UserRole.Guest, false);
        }

        private static Guid GetUserId(ClaimsPrincipal user)
        {
            var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim != null && Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return userId;
            }

            userIdClaim = user.FindFirst("sub") ?? user.FindFirst("id");
            if (userIdClaim != null && Guid.TryParse(userIdClaim.Value, out var altUserId))
            {
                return altUserId;
            }

            return Guid.Empty;
        }

        private static UserRole GetUserRole(ClaimsPrincipal user)
        {
            var roleClaim = user.FindFirst(ClaimTypes.Role);
            if (roleClaim != null && Enum.TryParse<UserRole>(roleClaim.Value, out var role))
            {
                return role;
            }

            roleClaim = user.FindFirst("role") ?? user.FindFirst("roles");
            if (roleClaim != null && Enum.TryParse<UserRole>(roleClaim.Value, out var altRole))
            {
                return altRole;
            }

            return UserRole.Guest;
        }

    }
}
