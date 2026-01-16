using ZvitPlus.BLL.DTOs.Stats;
using ZvitPlus.BLL.Services.Interfaces;
using ZvitPlus.DAL.Repositories.Interfaces;

namespace ZvitPlus.BLL.Services.Implementations
{
    public class StatsService(IUnitOfWork uow) : IStatsService
    {
        private readonly IUnitOfWork _unitOfWork = uow;

        public async Task<GetStatsDTO> GetAsync(CancellationToken ct = default)
        {
            var templateCount = await _unitOfWork.Templates.CountAsync(ct: ct);
            var reportCount = await _unitOfWork.Reports.CountAsync(ct: ct);
            var userCount = await _unitOfWork.Users.CountAsync(ct: ct);

            var response = new GetStatsDTO(
                TotalTemplates: templateCount,
                TotalReports: reportCount,
                TotalUsers: userCount);

            return response;
        }
    }
}
