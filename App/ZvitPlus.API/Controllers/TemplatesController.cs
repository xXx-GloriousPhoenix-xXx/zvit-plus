using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ZvitPlus.API.Context.Interfaces;
using ZvitPlus.API.DTOs.TemplateDTOs;
using ZvitPlus.BLL.DTOs.FileDTOs;
using ZvitPlus.BLL.DTOs.FileEntityDTOs;
using ZvitPlus.BLL.DTOs.TemplateDTOs;
using ZvitPlus.BLL.Services.Interfaces;
using GetTemplatePageDTO = ZvitPlus.BLL.DTOs.AdditionalDTOs.PagedResponse<ZvitPlus.BLL.DTOs.FileEntityDTOs.GetFileEntityDTO>;

namespace ZvitPlus.API.Controllers
{
    [ApiController]
    [Route("api/templates")]
    public class TemplatesController(ITemplateService service, IUserContextFactory contextFactory) : ControllerBase
    {
        private readonly ITemplateService _service = service;
        private readonly IUserContextFactory _contextFactory = contextFactory;

        [HttpPost]
        [Authorize(Policy = "UserLevel")]
        public async Task<ActionResult<GetFileEntityDTO>> AddAsync(
            [FromForm] CreateTemplateDTORequest request,
            CancellationToken ct = default)
        {
            var dto = new CreateTemplateDTO(
                Name: request.Name,
                Type: request.TemplateType,
                IsPrivate: request.IsPrivate,
                File: request.File.OpenReadStream()
            );

            var context = _contextFactory.CreateUserContext();
            var result = await _service.AddAsync(dto, context, ct);
            return Ok(result);
        }

        [HttpPatch("{id}")]
        [Authorize(Policy = "UserLevel")]
        public async Task<ActionResult<GetFileEntityDTO>> UpdateAsync(
            [FromRoute] Guid id,
            [FromBody] UpdateTemplateDTO dto,
            CancellationToken ct = default)
        {
            var userContext = _contextFactory.CreateUserContext();
            var result = await _service.UpdateAsync(id, dto, userContext, ct);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "UserLevel")]
        public async Task<ActionResult> DeleteAsync(
            [FromRoute] Guid id,
            CancellationToken ct = default)
        {
            var userContext = _contextFactory.CreateUserContext();
            await _service.DeleteAsync(id, userContext, ct);
            return Ok();
        }

        [HttpGet("{page}/{itemsPerPage}")]
        public async Task<ActionResult<GetTemplatePageDTO>> GetPageAsync(
            [FromRoute] int page = 1,
            [FromRoute] int itemsPerPage = 10,
            [FromQuery] SearchFileEntityDTO? dto = null,
            CancellationToken ct = default)
        {
            var userContext = _contextFactory.CreateUserContext();
            var result = await _service.GetPageAsync(userContext, page, itemsPerPage, dto, ct);
            return Ok(result);
        }

        [HttpGet("{id}")]
        [Authorize(Policy = "UserLevel")]
        public async Task<ActionResult<GetFullFileEntityDTO>> GetById(
            [FromRoute] Guid id,
            CancellationToken ct = default)
        {
            var result = await _service.GetByIdAsync(id, ct);
            return Ok(result);
        }
    }
}
