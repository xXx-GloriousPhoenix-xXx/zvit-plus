using ZvitPlus.DAL.Models.Entities;

namespace ZvitPlus.BLL.Services.Interfaces
{
    public interface IRefreshTokenService
    {
        Task<IEnumerable<RefreshToken>> GetAllAsync(CancellationToken ct = default);
    }
}
