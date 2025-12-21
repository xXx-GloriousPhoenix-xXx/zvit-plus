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
        [HttpPost("register")]
        public async Task<ActionResult> RegisterAsync([FromForm] RegisterDTO dto, CancellationToken ct = default)
        {
            await service.RegisterAsync(dto, ct);
            return Ok(new { message = "Registed Successfully!" });
        }

        [HttpPost("login")]
        public async Task<ActionResult<TokenDTO>> LoginAsync([FromForm] LoginDTO dto, CancellationToken ct = default)
        {
            var result = await service.LoginAsync(dto, ct);
            return Ok(result);
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<ActionResult> LogoutAsync(CancellationToken ct = default)
        {
            await service.LogoutAsync(ct);
            return Ok(new { message = "Logged Out Successfully!" });
        }

        [HttpPost("refresh")]
        [Authorize]
        public async Task<ActionResult<TokenDTO>> RefreshAsync([FromForm] RefreshDTO dto, CancellationToken ct = default)
        {
            var result = await service.RefreshAsync(dto, ct);
            return Ok(result);
        }
    }
}
