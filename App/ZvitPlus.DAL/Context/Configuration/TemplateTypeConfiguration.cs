using ZvitPlus.DAL.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ZvitPlus.DAL.Context.Configuration
{
    public class TemplateTypeConfiguration : BaseEntityConfiguration<TemplateType>
    {
        public override void Configure(EntityTypeBuilder<TemplateType> builder)
        {
            base.Configure(builder);

            builder.ToTable("template_types");

            builder.Property(tt => tt.Name)
                .HasColumnName("name")
                .IsRequired()
                .HasMaxLength(32)
                .HasColumnType("nvarchar(32)");

            //builder.HasMany(tt => tt.Templates)
            //    .WithOne(t => t.TemplateType)
            //    .HasForeignKey(t => t.TemplateTypeId)
            //    .HasConstraintName("fk_template_template_type")
            //    .OnDelete(DeleteBehavior.Restrict);

            builder.HasIndex(tt => tt.Name)
                .HasDatabaseName("idx_template_types_name")
                .IsUnique();
        }
    }
}
