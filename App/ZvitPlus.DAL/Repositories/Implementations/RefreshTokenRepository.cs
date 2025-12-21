using ZvitPlus.DAL.Context;
using ZvitPlus.DAL.Models.Entities;
using ZvitPlus.DAL.Repositories.Interfaces;

namespace ZvitPlus.DAL.Repositories.Implementations
{
    public class RefreshTokenRepository(ZvitPlusDbContext context)
        : BaseRepository<RefreshToken>(context), IRefreshTokenRepository
    {
        public async Task<RefreshToken?> GetByTokenAsync(string refreshToken, CancellationToken ct = default)
        {
            var singleItemCollection = await FindAsync(rt =>
                rt.Token == refreshToken, ct);
            return singleItemCollection.SingleOrDefault();
        }
    }
}
