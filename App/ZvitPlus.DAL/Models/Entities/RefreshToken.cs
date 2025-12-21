namespace ZvitPlus.DAL.Models.Entities
{
    public class RefreshToken : BaseEntity
    {
        public required string Token { get; set; }
        public Guid UserId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime ExpiresAt { get; set; }
        public bool IsRevoked { get; set; }
        public virtual User? User { get; set; }
    }
}
