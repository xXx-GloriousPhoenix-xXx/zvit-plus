using ZvitPlus.BLL.DTOs.AdditionalDTOs;
using ZvitPlus.BLL.DTOs.FileEntityDTOs;
using ZvitPlus.BLL.DTOs.ReportDTOs;
using ZvitPlus.BLL.Services.Interfaces;

namespace ZvitPlus.BLL.Services.Implementations
{
    public class ReportService : IReportService
    {
        public Task<GetFileEntityDTO> AddAsync(CreateReportDTO dto, CancellationToken ct = default)
        {
            throw new NotImplementedException();
        }

        public Task DeleteAsync(Guid id, CancellationToken ct = default)
        {
            throw new NotImplementedException();
        }

        public Task<GetFullFileEntityDTO> GetByIdAsync(Guid id, CancellationToken ct = default)
        {
            throw new NotImplementedException();
        }

        public Task<PagedResponse<GetFileEntityDTO>> GetPageAsync(int page, int pageSize, SearchFileEntityDTO? search, CancellationToken ct = default)
        {
            throw new NotImplementedException();
        }

        public Task<GetFileEntityDTO> UpdateAsync(Guid id, UpdateReportDTO dto, CancellationToken ct = default)
        {
            throw new NotImplementedException();
        }
    }
}
