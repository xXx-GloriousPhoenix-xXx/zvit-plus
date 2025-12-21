using System.ComponentModel.DataAnnotations;

namespace ZvitPlus.BLL.DTOs.AuthDTOs
{
    public class RefreshDTO
    {
        [Required]
        public required string RefreshToken { get; set; }
    }
}
