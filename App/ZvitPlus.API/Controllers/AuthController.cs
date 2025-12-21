using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ZvitPlus.BLL.DTOs.AuthDTOs;
using ZvitPlus.BLL.Services.Interfaces;

namespace ZvitPlus.API.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController(IAuthService service) : ControllerBase
    {
        private readonly IAuthService _service = service;

        [HttpPost("register")]
        public async Task<ActionResult> RegisterAsync([FromForm] RegisterDTO dto, CancellationToken ct = default)
        {
            await _service.RegisterAsync(dto, ct);
            return Ok(new { message = "Registed Successfully!" });
        }

        [HttpPost("login")]
        public async Task<ActionResult<TokenDTO>> LoginAsync([FromForm] LoginDTO dto, CancellationToken ct = default)
        {
            var result = await _service.LoginAsync(dto, ct);
            return Ok(result);
        }

        [HttpPost("logout/{refreshToken}")]
        [Authorize]
        public async Task<ActionResult> LogoutAsync(string refreshToken, CancellationToken ct = default)
        {
            await _service.LogoutAsync(refreshToken, ct);
            return Ok(new { message = "Logged Out Successfully!" });
        }

        [HttpPost("refresh/{refreshToken}")]
        [Authorize]
        public async Task<ActionResult<TokenDTO>> RefreshAsync(string refreshToken, CancellationToken ct = default)
        {
            var result = await _service.RefreshAsync(refreshToken, ct);
            return Ok(result);
        }
    }
}
