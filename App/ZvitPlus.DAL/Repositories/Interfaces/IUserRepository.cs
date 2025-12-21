using ZvitPlus.DAL.Models.Entities;

namespace ZvitPlus.DAL.Repositories.Interfaces
{
    public interface IUserRepository : IBaseRepository<User>
    {
        Task<User?> GetByLoginAsync(string login, CancellationToken ct = default);
        Task<User?> GetByEmailAsync(string email, CancellationToken ct = default);
    }
}
