using ZvitPlus.DAL.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ZvitPlus.DAL.Context.Configuration
{
    public class TemplateConfiguration : BaseEntityConfiguration<Template>
    {
        public override void Configure(EntityTypeBuilder<Template> builder)
        {
            base.Configure(builder);

            builder.ToTable("templates");

            builder.Property(t => t.TemplateTypeId)
                .HasColumnName("template_type")
                .HasColumnType("uniqueidentifier")
                .IsRequired();

            builder.Property(t => t.FileId)
                .HasColumnName("file")
                .HasColumnType("uniqueidentifier")
                .IsRequired();

            builder.HasOne(t => t.TemplateType)
                .WithMany(tt => tt.Templates)
                .HasForeignKey(t => t.TemplateTypeId)
                .HasConstraintName("fk_templates_template_types_id")
                .OnDelete(DeleteBehavior.Restrict)
                .IsRequired();

            builder.HasOne(t => t.File)
                .WithOne(f => f.Template)
                .HasForeignKey<Template>(t => t.FileId)
                .HasConstraintName("fk_templates_files_id")
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();

            builder.HasIndex(t => t.TemplateTypeId)
                .HasDatabaseName("idx_templates_template_type_id");

            builder.HasIndex(t => t.FileId)
                .HasDatabaseName("idx_templates_file_id")
                .IsUnique();
        }
    }
}
