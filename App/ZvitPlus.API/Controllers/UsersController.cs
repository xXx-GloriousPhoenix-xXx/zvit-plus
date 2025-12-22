using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ZvitPlus.BLL.Services.Interfaces;

namespace ZvitPlus.API.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UsersController(IUserService service) : ControllerBase
    {
        private readonly IUserService _service = service;

        [HttpGet]
        public async Task<ActionResult> GetAllAsync(CancellationToken ct = default)
        {
            var result = await _service.GetAllAsync(ct);
            return Ok(result);
        }

        [HttpGet("authcheck")]
        [Authorize]
        public async Task<ActionResult> GetAllAuthAsync(CancellationToken ct = default)
        {
            var result = await _service.GetAllAsync(ct);
            return Ok(result);
        }
    }
}
