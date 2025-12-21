using ZvitPlus.BLL.Services.Interfaces;
using ZvitPlus.DAL.Models.Entities;
using ZvitPlus.DAL.Repositories.Interfaces;

namespace ZvitPlus.BLL.Services.Implementations
{
    public class RefreshTokenService(IUnitOfWork unitOfWork) : IRefreshTokenService
    {
        private readonly IUnitOfWork _unitOfWork = unitOfWork;

        public async Task<IEnumerable<RefreshToken>> GetAllAsync(CancellationToken ct = default)
        {
            return await _unitOfWork.RefreshTokens.GetAllAsync(ct);
        }
    }
}
