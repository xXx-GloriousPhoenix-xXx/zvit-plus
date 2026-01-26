using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ZvitPlus.API.Context.Interfaces;
using ZvitPlus.API.DTOs.ReportDTOs;
using ZvitPlus.BLL.DTOs.AdditionalDTOs;
using ZvitPlus.BLL.DTOs.FileEntityDTOs;
using ZvitPlus.BLL.DTOs.ReportDTOs;
using ZvitPlus.BLL.Services.Interfaces;

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
            if (!ModelState.IsValid)
            {
                foreach (var kv in ModelState)
                {
                    Console.WriteLine($"{kv.Key}: {kv.Value.Errors.Count} errors");
                    foreach (var err in kv.Value.Errors)
                        Console.WriteLine($"  -> {err.ErrorMessage}");
                }
                return BadRequest(ModelState);
            }

            if (request.File == null)
                return BadRequest("File is required");

            Console.WriteLine($"In Controller: {request.TemplateId}");

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
            [FromForm] UpdateReportDTORequest request,
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
        public async Task<ActionResult<PagedResponse<GetFileEntityDTO>>> GetPageAsync(
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
        public async Task<ActionResult<GetFileEntityDTO>> GetById(
            [FromRoute] Guid id,
            CancellationToken ct = default)
        {
            var result = await _service.GetByIdAsync(id, ct);
            return Ok(result);
        }

        [HttpGet("my/{page}/{itemsPerPage}")]
        [Authorize(Policy = "UserLevel")]
        public async Task<ActionResult<PagedResponse<GetFileEntityDTO>>> GetMyPageAsync(
            [FromRoute] int page = 1,
            [FromRoute] int itemsPerPage = 10,
            CancellationToken ct = default)
        {
            var userContext = _context.CreateUserContext();
            var result = await _service.GetMyPageAsync(userContext, page, itemsPerPage, ct);
            return Ok(result);
        }

        [HttpGet("{id}/download")]
        public async Task<IActionResult> DownloadAsync([FromRoute] Guid id, CancellationToken ct = default)
        {
            var (entity, stream) = await _service.DownloadAsync(id, ct);
            return File(
                stream,
                "application/octet-stream",
                $"{entity.Name}.rep");
        }
    }
}
