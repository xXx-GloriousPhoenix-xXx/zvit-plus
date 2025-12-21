using ZvitPlus.DAL.Context;
using ZvitPlus.DAL.Models.Entities;
using ZvitPlus.DAL.Repositories.Interfaces;

namespace ZvitPlus.DAL.Repositories.Implementations
{
    public class UserRepository(ZvitPlusDbContext context)
        : BaseRepository<User>(context), IUserRepository
    {
        public async Task<User?> GetByEmailAsync(string email, CancellationToken ct = default)
        {
            var singleItemCollection = await FindAsync(u => u.Email == email, ct);
            return singleItemCollection.SingleOrDefault();
        }

        public async Task<User?> GetByLoginAsync(string login, CancellationToken ct = default)
        {
            var singleItemCollection = await FindAsync(u => u.Login == login, ct);
            return singleItemCollection.SingleOrDefault();
        }
    }
}
