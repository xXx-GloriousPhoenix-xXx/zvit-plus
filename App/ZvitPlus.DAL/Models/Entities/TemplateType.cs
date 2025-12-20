namespace ZvitPlus.DAL.Models.Entities
{
    public class TemplateType : BaseEntity
    {
        public required string Name { get; set; }
        public virtual ICollection<Template> Templates { get; set; } = [];
    }
}
