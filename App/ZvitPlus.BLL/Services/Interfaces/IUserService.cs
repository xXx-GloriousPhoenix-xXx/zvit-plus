using ZvitPlus.BLL.Context;
using ZvitPlus.BLL.DTOs.UserDTOs;
using ZvitPlus.DAL.Models.Enums;

namespace ZvitPlus.BLL.Services.Interfaces
{
    public interface IUserService
    {
        Task<GetUserDTO> GrantRoleAsync(Guid userId, UserRole role, UserContext context, CancellationToken ct = default);
        Task<GetUserDTO> BanAsync(Guid userId, bool isBan, UserContext context, CancellationToken ct = default);
    }
}
