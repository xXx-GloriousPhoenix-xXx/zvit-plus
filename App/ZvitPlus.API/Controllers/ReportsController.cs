using Microsoft.AspNetCore.Mvc;
using ZvitPlus.BLL.DTOs.FileEntityDTOs;
using ZvitPlus.BLL.DTOs.ReportDTOs;
using ZvitPlus.BLL.Context;
using ZvitPlus.BLL.Services.Interfaces;

using GetReportPageDTO = ZvitPlus.BLL.DTOs.AdditionalDTOs.PagedResponse<ZvitPlus.BLL.DTOs.FileEntityDTOs.GetFileEntityDTO>;
using Microsoft.AspNetCore.Authorization;
using ZvitPlus.API.Context.Interfaces;
using ZvitPlus.API.DTOs.TemplateDTOs;
using ZvitPlus.API.DTOs.ReportDTOs;

namespace ZvitPlus.API.Controllers
{
    [ApiController]
    [Route("api/reports")]
    public class ReportsController(IReportService service, IUserContextFactory context) : ControllerBase
    {
        private readonly IReportService _service = service;
        private readonly IUserContextFactory _context = context;

        [HttpPost]
        [Authorize(Policy = "UserLevel")]
        public async Task<ActionResult<GetFileEntityDTO>> AddAsync(
            [FromForm] CreateReportDTORequest request,
            CancellationToken ct = default)
        {
            var dto = new CreateReportDTO(
                Name: request.Name,
                TemplateId: request.TemplateId,
                IsPrivate: request.IsPrivate,
                File: request.File.OpenReadStream());

            var userContext = _context.CreateUserContext();
            var result = await _service.AddAsync(dto, userContext, ct);
            return Ok(result);
        }

        [HttpPatch("{id}")]
        [Authorize(Policy = "UserLevel")]
        public async Task<ActionResult<GetFileEntityDTO>> UpdateAsync(
            [FromRoute] Guid id,
            [FromBody] UpdateReportDTORequest request,
            CancellationToken ct = default)
        {
            var dto = new UpdateReportDTO(
                Name: request.Name,
                IsPrivate: request.IsPrivate,
                File: request.File?.OpenReadStream());

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
        public async Task<ActionResult<GetReportPageDTO>> GetPageAsync(
            [FromRoute] int page = 1,
            [FromRoute] int itemsPerPage = 10,
            [FromQuery] SearchFileEntityDTO? dto = null,
            CancellationToken ct = default)
        {
            var userContext = _context.CreateUserContext();
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
