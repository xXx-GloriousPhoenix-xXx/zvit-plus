using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ZvitPlus.API.Context.Interfaces;
using ZvitPlus.API.Extensions.AuthorizationExtensions;
using ZvitPlus.BLL.Context;
using ZvitPlus.BLL.DTOs.FileEntityDTOs;
using ZvitPlus.BLL.DTOs.TemplateDTOs;
using ZvitPlus.BLL.Services.Interfaces;
using GetTemplatePageDTO = ZvitPlus.BLL.DTOs.AdditionalDTOs.PagedResponse<ZvitPlus.BLL.DTOs.FileEntityDTOs.GetFileEntityDTO>;

namespace ZvitPlus.API.Controllers
{
    [ApiController]
    [Route("api/templates")]
    public class TemplatesController(ITemplateService service, IUserContextFactory context) : ControllerBase
    {
        private readonly ITemplateService _service = service;
        private readonly IUserContextFactory _context = context;

        [HttpPost]
        [Authorize(Policy = "UserLevel")]
        public async Task<ActionResult<GetFileEntityDTO>> AddAsync(
            [FromForm] CreateTemplateDTO dto,
            CancellationToken ct = default)
        {
            var result = await _service.AddAsync(dto, ct);
            return Ok(result);
        }

        [HttpPatch("{id}")]
        [Authorize(Policy = "UserLevel")]
        public async Task<ActionResult<GetFileEntityDTO>> UpdateAsync(
            [FromRoute] Guid id,
            [FromBody] UpdateTemplateDTO dto,
            CancellationToken ct = default)
        {
            var userContext = _context.CreateUserContext();
            var result = await _service.UpdateAsync(id, dto, userContext, ct);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "UserLevel")]
        public async Task<ActionResult> DeleteAsync(
            [FromRoute] Guid id,
            CancellationToken ct = default)
        {
            var userContext = _context.CreateUserContext();
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
            var userContext = _context.CreateUserContext();
            var result = await _service.GetPageAsync(page, itemsPerPage, userContext, dto, ct);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<GetFullFileEntityDTO>> GetById(
            [FromRoute] Guid id,
            CancellationToken ct = default)
        {
            var result = await _service.GetByIdAsync(id, ct);
            return Ok(result);
        }
    }
}
