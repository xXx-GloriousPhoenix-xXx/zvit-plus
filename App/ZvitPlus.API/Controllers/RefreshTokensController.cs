using Microsoft.AspNetCore.Mvc;
using ZvitPlus.BLL.Services.Interfaces;

namespace ZvitPlus.API.Controllers
{
    [ApiController]
    [Route("api/tokens")]
    public class RefreshTokensController(IRefreshTokenService service) : ControllerBase
    {
        private readonly IRefreshTokenService _service = service;

        [HttpGet]
        public async Task<ActionResult> GetAllAsync(CancellationToken ct = default)
        {
            var result = await _service.GetAllAsync(ct);
            return Ok(result);
        }
    }
}
