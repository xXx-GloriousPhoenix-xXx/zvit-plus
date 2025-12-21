using Microsoft.AspNetCore.Mvc;
using ZvitPlus.BLL.DTOs.AuthDTOs;

namespace ZvitPlus.API.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        [HttpPost("register")]
        public async Task<ActionResult<TokenDTO>> RegisterAsync([FromForm] RegisterDTO dto, CancellationToken ct = default)
        {
            //var result = await ...
            return Ok();
        }

        [HttpPost("login")]
        public async Task<ActionResult<TokenDTO>> LoginAsync(LoginDTO dto, CancellationToken ct = default)
        {
            //var result = await ...
            return Ok();
        }
    }
}
