using ZvitPlus.DAL.Models.Enums;

namespace ZvitPlus.DAL.Models.Entities
{
    public class User : BaseEntity
    {
        public required string Login { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public UserRole Role { get; set; } = UserRole.User;
        public bool IsBanned { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public virtual ICollection<FileEntity> Files { get; set; } = [];
        public virtual ICollection<RefreshToken> RefreshTokens { get; set; } = [];
    }
}
