using Microsoft.AspNetCore.Mvc;
using ZvitPlus.BLL.DTOs.AuthDTOs;

namespace ZvitPlus.API.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        [HttpPost("register")]
        public async Task<ActionResult<TokenDTO>> RegisterAsync(RegisterDTO dto)
        {
            //var result = await ...
            return Ok();
        }

        [HttpPost("login")]
        public async Task<ActionResult<TokenDTO>> LoginAsync(LoginDTO dto)
        {
            //var result = await ...
            return Ok();
        }
    }
}
