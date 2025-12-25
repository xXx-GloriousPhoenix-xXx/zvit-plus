using ZvitPlus.BLL.Context;
using ZvitPlus.BLL.DTOs.AdditionalDTOs;
using ZvitPlus.BLL.DTOs.FileDTOs;
using ZvitPlus.BLL.DTOs.FileEntityDTOs;
using ZvitPlus.BLL.DTOs.TemplateDTOs;
using ZvitPlus.BLL.Services.Interfaces;
using ZvitPlus.DAL.Models.Enums;

namespace ZvitPlus.BLL.Services.Implementations
{
    public class TemplateService : ITemplateService
    {
        public Task<GetFileEntityDTO> AddAsync(CreateTemplateDTO dto, CancellationToken ct = default)
        {
            throw new NotImplementedException();
        }

        public Task DeleteAsync(Guid id, UserContext context, CancellationToken ct = default)
        {
            throw new NotImplementedException();
        }

        public Task<GetFullFileEntityDTO> GetByIdAsync(Guid id, CancellationToken ct = default)
        {
            throw new NotImplementedException();
        }

        public Task<PagedResponse<GetFileEntityDTO>> GetPageAsync(int page, int pageSize, UserContext context, SearchFileEntityDTO? search, CancellationToken ct = default)
        {
            throw new NotImplementedException();
        }

        public Task<GetFileEntityDTO> UpdateAsync(Guid id, UpdateTemplateDTO dto, UserContext context, CancellationToken ct = default)
        {
            throw new NotImplementedException();
        }
    }
}
