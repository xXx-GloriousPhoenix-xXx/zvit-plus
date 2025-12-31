using System.ComponentModel.DataAnnotations;

namespace ZvitPlus.BLL.DTOs.AuthDTOs
{
    public sealed class LoginDTO
    {
        [Required(ErrorMessage = "Логін або email обов'язковий")]
        public required string LoginOrEmail { get; init; }

        [Required(ErrorMessage = "Пароль обов'язковий")]
        public required string Password { get; init; }
    }
}
