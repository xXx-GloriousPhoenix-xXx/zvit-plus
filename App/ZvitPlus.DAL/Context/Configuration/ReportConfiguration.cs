using ZvitPlus.DAL.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ZvitPlus.DAL.Context.Configuration
{
    public class ReportConfiguration : BaseEntityConfiguration<Report>
    {
        public override void Configure(EntityTypeBuilder<Report> builder)
        {
            base.Configure(builder);

            builder.ToTable("reports");

            builder.Property(r => r.TemplateId)
                .HasColumnName("template")
                .HasColumnType("uniqueidentifier")
                .IsRequired();

            builder.Property(r => r.FileId)
                .HasColumnName("file")
                .HasColumnType("uniqueidentifier")
                .IsRequired();

            builder.HasOne(r => r.Template)
                .WithMany(t => t.Reports)
                .HasForeignKey(r => r.TemplateId)
                .HasConstraintName("fk_reports_templates_id")
                .OnDelete(DeleteBehavior.Restrict)
                .IsRequired();

            builder.HasOne(r => r.File)
                .WithOne(f => f.Report)
                .HasForeignKey<Report>(r => r.FileId)
                .HasConstraintName("fk_reports_files_id")
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();

            builder.HasIndex(r => r.TemplateId)
                .HasDatabaseName("idx_reports_template_id");

            builder.HasIndex(r => r.FileId)
                .HasDatabaseName("idx_reports_file_id")
                .IsUnique();
        }
    }
}
