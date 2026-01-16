using ZvitPlus.BLL.DTOs.Stats;

namespace ZvitPlus.BLL.Services.Interfaces
{
    public interface IStatsService
    {
        Task<GetStatsDTO> GetAsync(CancellationToken ct = default);
    }

}
