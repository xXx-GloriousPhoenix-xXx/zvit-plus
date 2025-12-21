namespace ZvitPlus.DAL.Models.Entities
{
    public class Report : BaseEntity
    {
        public Guid TemplateId { get; set; }
        public Guid FileId { get; set; }
        public virtual Template? Template { get; set; }
        public virtual FileEntity? File { get; set; }
    }
}
