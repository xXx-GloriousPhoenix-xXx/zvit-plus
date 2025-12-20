using ZvitPlus.DAL.Models.Enums;

namespace ZvitPlus.DAL.Models.Entities
{
    public class User : BaseEntity
    {
        public required string Login { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public UserRole Role { get; set; }
        public bool IsBanned { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public virtual ICollection<FileEntity> Files { get; set; } = [];

    }
}
