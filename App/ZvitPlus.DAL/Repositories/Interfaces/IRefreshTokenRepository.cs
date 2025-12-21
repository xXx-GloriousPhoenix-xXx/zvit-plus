using ZvitPlus.DAL.Models.Entities;

namespace ZvitPlus.DAL.Repositories.Interfaces
{
    public interface IRefreshTokenRepository : IBaseRepository<RefreshToken>
    {
        Task<RefreshToken?> GetByTokenAsync(string refreshToken, CancellationToken ct = default);
    }
}
