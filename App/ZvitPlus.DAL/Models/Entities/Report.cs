namespace ZvitPlus.DAL.Models.Entities
{
    public class Report : BaseEntity
    {
        public Guid TemplateId { get; set; }
        public Guid FileId { get; set; }
        public Template? Template { get; set; }
        public FileEntity? File { get; set; }
    }
}
