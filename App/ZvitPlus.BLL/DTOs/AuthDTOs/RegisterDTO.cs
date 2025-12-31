using System.ComponentModel.DataAnnotations;

namespace ZvitPlus.BLL.DTOs.AuthDTOs
{
    public sealed class RegisterDTO
    {
        [Required(ErrorMessage = "Логін обов'язковий")]
        [MinLength(4, ErrorMessage = "Логін повинен містити мінімум 4 символи")]
        [MaxLength(16, ErrorMessage = "Логін не може перевищувати 16 символів")]
        [RegularExpression(
            @"^[a-zA-Z0-9_.-]+$",
            ErrorMessage = "Логін може містити лише літери, цифри, крапки, тире та підкреслення")]
        public required string Login { get; init; }

        [Required(ErrorMessage = "Електронна пошта обов'язкова")]
        [EmailAddress(ErrorMessage = "Невірний формат електронної пошти")]
        [MaxLength(64, ErrorMessage = "Електронна пошта не може перевищувати 64 символів")]
        public required string Email { get; init; }

        [Required(ErrorMessage = "Пароль обов'язковий")]
        [MinLength(8, ErrorMessage = "Пароль повинен містити мінімум 8 символів")]
        [MaxLength(64, ErrorMessage = "Пароль не може перевищувати 64 символи")]
        [DataType(DataType.Password)]
        [RegularExpression(
            @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$",
            ErrorMessage = "Пароль повинен містити великі та малі літери, цифри та спеціальні символи")]
        public required string Password { get; init; }
    }
}
