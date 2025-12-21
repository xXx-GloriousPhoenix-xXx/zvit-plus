namespace ZvitPlus.BLL.DTOs.AuthDTOs
{
    public class TokenDTO
    {
        public required string Token { get; set; }
        public int ExpiresIn { get; set; }
    }
}
