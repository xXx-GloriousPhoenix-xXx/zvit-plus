using ZvitPlus.DAL.Models.Entities;

namespace ZvitPlus.BLL.Services.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<User>> GetAllAsync(CancellationToken ct = default);
    }
}
