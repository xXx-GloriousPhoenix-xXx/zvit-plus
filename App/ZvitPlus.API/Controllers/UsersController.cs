using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ZvitPlus.BLL.DTOs.UserDTOs;
using ZvitPlus.BLL.Services.Interfaces;
using ZvitPlus.DAL.Models.Enums;

namespace ZvitPlus.API.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UsersController(IUserService service) : ControllerBase
    {
        private readonly IUserService _service = service;

        [HttpPost("{userId}/grant/{role}")]
        [Authorize(Policy = "AdminLevel")]
        public async Task<ActionResult<GetUserDTO>> GrantRoleAsync(Guid userId, UserRole role, CancellationToken ct = default)
        {
            var result = await _service.GrantRoleAsync(userId, role, ct);
            return Ok(result);
        }

        [HttpPost("{userId}/ban/{isBan}")]
        [Authorize(Policy = "ModLevel")]
        public async Task<ActionResult<GetUserDTO>> BanAsync(Guid userId, bool isBan, CancellationToken ct = default)
        {
            var result = await _service.BanAsync(userId, isBan, ct);
            return Ok(result);
        }
    }
}
