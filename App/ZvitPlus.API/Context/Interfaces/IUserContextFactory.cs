using ZvitPlus.BLL.Context;
namespace ZvitPlus.API.Context.Interfaces
{
    public interface IUserContextFactory
    {
        UserContext CreateUserContext();
        UserContext CreateGuestContext();
    }
}
