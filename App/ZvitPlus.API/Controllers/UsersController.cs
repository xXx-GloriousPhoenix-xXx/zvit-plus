using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ZvitPlus.BLL.DTOs.UserDTOs;
using ZvitPlus.BLL.Services.Interfaces;
using ZvitPlus.DAL.Models.Enums;
using ZvitPlus.API.Context.Interfaces;

namespace ZvitPlus.API.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UsersController(IUserService service, IUserContextFactory contextFactory) : ControllerBase
    {
        private readonly IUserService _service = service;
        private readonly IUserContextFactory _contextFactory = contextFactory;

        [HttpPost("{userId}/grant/{role}")]
        [Authorize(Policy = "AdminLevel")]
        public async Task<ActionResult<GetUserDTO>> GrantRoleAsync(Guid userId, UserRole role, CancellationToken ct = default)
        {
            var context = _contextFactory.CreateUserContext();
            var result = await _service.GrantRoleAsync(userId, role, context, ct);
            return Ok(result);
        }

        [HttpPost("{userId}/ban/{isBan}")]
        [Authorize(Policy = "ModLevel")]
        public async Task<ActionResult<GetUserDTO>> BanAsync(Guid userId, bool isBan, CancellationToken ct = default)
        {
            var context = _contextFactory.CreateUserContext();
            var result = await _service.BanAsync(userId, isBan, context, ct);
            return Ok(result);
        }
    }
}
