using AutoMapper;
using ZvitPlus.BLL.DTOs.TemplateTypeDTO;
using ZvitPlus.BLL.Services.Interfaces;
using ZvitPlus.DAL.Repositories.Interfaces;

namespace ZvitPlus.BLL.Services.Implementations
{
    public class TemplateTypeService(IUnitOfWork unitOfWork, IMapper mapper) : ITemplateTypeService
    {
        private readonly IUnitOfWork _unitOfWork = unitOfWork;
        private readonly IMapper _mapper = mapper;

        public async Task<IEnumerable<GetTemplateTypeDTO>> GetAllAsync(CancellationToken ct = default)
        {
            var collection = await _unitOfWork.TemplateTypes.GetAllAsync(ct);
            var mappedCollection = _mapper.Map<GetTemplateTypeDTO[]>(collection);
            return mappedCollection;
        }
    }
}
