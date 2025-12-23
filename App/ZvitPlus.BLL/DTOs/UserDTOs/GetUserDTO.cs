using ZvitPlus.DAL.Models.Enums;

namespace ZvitPlus.BLL.DTOs.UserDTOs
{
    public sealed record GetUserDTO(
        Guid Id,
        string Name,
        UserRole Role,
        bool IsBanned
    );
}
