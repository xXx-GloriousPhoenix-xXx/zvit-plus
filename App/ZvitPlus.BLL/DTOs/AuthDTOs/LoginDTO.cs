using System.ComponentModel.DataAnnotations;

namespace ZvitPlus.BLL.DTOs.AuthDTOs
{
    public sealed record LoginDTO(
        [property: Required(ErrorMessage = "Логін або електронна пошта обов'язкові")]
        string LoginOrEmail,

        [property: Required(ErrorMessage = "Пароль обов'язковий")]
        [property: DataType(DataType.Password)]
        string Password
    );
}
