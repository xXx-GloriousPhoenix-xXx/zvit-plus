using Microsoft.AspNetCore.Mvc;
using ZvitPlus.BLL.DTOs.FileDTOs;
using ZvitPlus.BLL.DTOs.FileEntityDTOs;
using ZvitPlus.BLL.DTOs.TemplateDTOs;
using ZvitPlus.BLL.Services.Interfaces;

using GetTemplatePageDTO = ZvitPlus.BLL.DTOs.AdditionalDTOs.PagedResponse<ZvitPlus.BLL.DTOs.FileEntityDTOs.GetFileEntityDTO>;

namespace ZvitPlus.API.Controllers
{
    [ApiController]
    [Route("api/templates")]
    public class TemplatesController(ITemplateService service) : ControllerBase
    {
        private readonly ITemplateService _service = service;

        [HttpPost]
        public async Task<ActionResult<GetFileEntityDTO>> AddAsync(
            [FromForm] CreateTemplateDTO dto,
            CancellationToken ct = default)
        {
            var result = await _service.AddAsync(dto, ct);
            return Ok(result);
        }

        [HttpPatch("{id}")]
        public async Task<ActionResult<GetFileEntityDTO>> UpdateAsync(
            [FromRoute] Guid id,
            [FromBody] UpdateTemplateDTO dto,
            CancellationToken ct = default)
        {
            var result = await _service.UpdateAsync(id, dto, ct);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteAsync(
            [FromRoute] Guid id,
            CancellationToken ct = default)
        {
            await _service.DeleteAsync(id, ct);
            return Ok();
        }

        [HttpGet("{page}/{itemsPerPage}")]
        public async Task<ActionResult<GetTemplatePageDTO>> GetPageAsync(
            [FromRoute] int page = 1,
            [FromRoute] int itemsPerPage = 10,
            [FromBody] SearchFileEntityDTO? dto = null,
            CancellationToken ct = default)
        {
            var result = await _service.GetPageAsync(page, itemsPerPage, dto, ct);
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
