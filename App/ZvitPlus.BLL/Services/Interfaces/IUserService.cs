using ZvitPlus.BLL.DTOs.UserDTOs;
using ZvitPlus.DAL.Models.Enums;

namespace ZvitPlus.BLL.Services.Interfaces
{
    public interface IUserService
    {
        Task<GetUserDTO> GrantRoleAsync(Guid userId, UserRole role, CancellationToken ct = default);
        Task<GetUserDTO> BanAsync(Guid userId, bool isBan, CancellationToken ct = default);
    }
}
