using ZvitPlus.BLL.DTOs.FileDTOs;
using ZvitPlus.BLL.DTOs.FileEntityDTOs;
using ZvitPlus.BLL.DTOs.ReportDTOs;

namespace ZvitPlus.BLL.Services.Interfaces
{
    public interface IReportService : IFileEntityService
    {
         Task<GetFileEntityDTO> AddAsync(CreateReportDTO dto, CancellationToken ct = default);
         Task<GetFileEntityDTO> UpdateAsync(Guid id, UpdateReportDTO dto, CancellationToken ct = default);
    }
}
