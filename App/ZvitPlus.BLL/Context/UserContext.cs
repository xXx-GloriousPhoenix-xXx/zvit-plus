using ZvitPlus.DAL.Models.Enums;

namespace ZvitPlus.BLL.Context
{
    public sealed record UserContext(
        Guid UserId,
        UserRole Role,
        bool IsAuthenticated);
}
