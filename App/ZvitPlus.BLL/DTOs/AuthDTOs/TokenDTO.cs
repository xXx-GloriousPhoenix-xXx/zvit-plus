namespace ZvitPlus.BLL.DTOs.AuthDTOs
{
    public class TokenDTO
    {
        public required string AccessToken { get; set; }
        public required string RefreshToken { get; set; }
        public int ExpiresIn { get; set; }
    }
}
