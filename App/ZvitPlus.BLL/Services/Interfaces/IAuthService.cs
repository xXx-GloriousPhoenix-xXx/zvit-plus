using ZvitPlus.BLL.DTOs.AuthDTOs;

namespace ZvitPlus.BLL.Services.Interfaces
{
    public interface IAuthService
    {
        Task RegisterAsync(RegisterDTO dto, CancellationToken ct = default);
        Task<TokenDTO> LoginAsync(LoginDTO dto, CancellationToken ct = default);
        Task LogoutAsync(CancellationToken ct = default);
        Task<TokenDTO> RefreshAsync(RefreshDTO dto, CancellationToken ct = default);
    }
}
