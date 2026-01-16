using Microsoft.AspNetCore.Mvc;
using ZvitPlus.BLL.DTOs.Stats;
using ZvitPlus.BLL.Services.Interfaces;

namespace ZvitPlus.API.Controllers
{
    [ApiController]
    [Route("api/stats")]
    public class StatsController(IStatsService service) : ControllerBase
    {
        private readonly IStatsService _service = service;
        [HttpGet]
        public async Task<ActionResult<GetStatsDTO>> GetAsync(CancellationToken ct = default)
        {
            var response = await _service.GetAsync(ct);
            return Ok(response);
        }
    }
}
