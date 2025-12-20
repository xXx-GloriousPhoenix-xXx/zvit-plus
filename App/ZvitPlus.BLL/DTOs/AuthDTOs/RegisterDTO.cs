using System.ComponentModel.DataAnnotations;

namespace ZvitPlus.BLL.DTOs.AuthDTOs
{
    public class RegisterDTO
    {
        [Required(ErrorMessage = "Логін обов'язковий")]
        [MinLength(8, ErrorMessage = "Логін повинен містити мінімум 8 символи")]
        [MaxLength(64, ErrorMessage = "Логін не може перевищувати 64 символи")]
        [RegularExpression(@"^[a-zA-Z0-9_.-]+$", ErrorMessage = "Логін може містити лише літери, цифри, крапки, тире та підкреслення")]
        public required string Login { get; set; }

        [Required(ErrorMessage = "Електронна пошта обов'язкова")]
        [EmailAddress(ErrorMessage = "Невірний формат електронної пошти")]
        [MaxLength(64, ErrorMessage = "Електронна пошта не може перевищувати 64 символів")]
        public required string Email { get; set; }

        [Required(ErrorMessage = "Пароль обов'язковий")]
        [MinLength(8, ErrorMessage = "Пароль повинен містити мінімум 8 символів")]
        [MaxLength(64, ErrorMessage = "Пароль не може перевищувати 64 символи")]
        [DataType(DataType.Password)]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$",
            ErrorMessage = "Пароль повинен містити великі та малі літери, цифри та спеціальні символи")]
        public required string Password { get; set; }

        [Required(ErrorMessage = "Підтвердження паролю обов'язкове")]
        [Compare(nameof(Password), ErrorMessage = "Паролі не співпадають")]
        [DataType(DataType.Password)]
        public required string ConfirmPassword { get; set; }
    }
}
