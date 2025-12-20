namespace ZvitPlus.DAL.Models.Entities
{
    public class Template : BaseEntity
    {
        public Guid TemplateTypeId { get; set; }
        public Guid FileId { get; set; }
        public TemplateType? TemplateType { get; set; }
        public FileEntity? File { get; set; }
        public virtual ICollection<Report> Reports { get; set; } = [];
    }
}
