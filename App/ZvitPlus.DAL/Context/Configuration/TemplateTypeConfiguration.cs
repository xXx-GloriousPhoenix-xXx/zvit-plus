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
                .HasColumnType("nvarchar(32)")
                .HasMaxLength(32)
                .IsRequired();

            builder.HasIndex(tt => tt.Name)
                .HasDatabaseName("idx_template_types_name")
                .IsUnique();
        }
    }
}
