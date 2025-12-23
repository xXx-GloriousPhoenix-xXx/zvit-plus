using System.ComponentModel.DataAnnotations;

namespace ZvitPlus.BLL.DTOs.AuthDTOs
{
    public sealed record RegisterDTO(
        [property: Required(ErrorMessage = "Логін обов'язковий")]
        [property: MinLength(4, ErrorMessage = "Логін повинен містити мінімум 4 символи")]
        [property: MaxLength(16, ErrorMessage = "Логін не може перевищувати 16 символів")]
        [property: RegularExpression(
            @"^[a-zA-Z0-9_.-]+$",
            ErrorMessage = "Логін може містити лише літери, цифри, крапки, тире та підкреслення")]
        string Login,

        [property: Required(ErrorMessage = "Електронна пошта обов'язкова")]
        [property: EmailAddress(ErrorMessage = "Невірний формат електронної пошти")]
        [property: MaxLength(64, ErrorMessage = "Електронна пошта не може перевищувати 64 символів")]
        string Email,

        [property: Required(ErrorMessage = "Пароль обов'язковий")]
        [property: MinLength(8, ErrorMessage = "Пароль повинен містити мінімум 8 символів")]
        [property: MaxLength(64, ErrorMessage = "Пароль не може перевищувати 64 символи")]
        [property: DataType(DataType.Password)]
        [property: RegularExpression(
            @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$",
            ErrorMessage = "Пароль повинен містити великі та малі літери, цифри та спеціальні символи")]
        string Password
    );
}
