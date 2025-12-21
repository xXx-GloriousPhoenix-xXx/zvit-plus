namespace ZvitPlus.DAL.Models.Entities
{
    public class FileEntity : BaseEntity
    {
        public required string Name { get; set; }
        public Guid AuthorId { get; set; }
        public int FileSize { get; set; }
        public required string FilePath { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public virtual User? Author { get; set; }
        public virtual Template? Template { get; set; }
        public virtual Report? Report { get; set; }
    }
}
