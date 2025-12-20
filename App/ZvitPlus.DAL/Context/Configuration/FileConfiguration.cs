using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ZvitPlus.DAL.Models.Entities;

namespace ZvitPlus.DAL.Context.Configuration
{
    public class FileConfiguration : BaseEntityConfiguration<FileEntity>
    {
        public override void Configure(EntityTypeBuilder<FileEntity> builder)
        {
            base.Configure(builder);

            builder.ToTable("files");

            builder.Property(f => f.Name)
                .HasColumnName("name")
                .IsRequired()
                .HasMaxLength(64)
                .HasColumnType("nvarchar(64)");

            builder.Property(f => f.AuthorId)
                .HasColumnName("author")
                .IsRequired();

            builder.Property(f => f.FileSize)
                .HasColumnName("file_size")
                .IsRequired();

            builder.Property(f => f.FilePath)
                .HasColumnName("file_path")
                .IsRequired()
                .HasMaxLength(255)
                .HasColumnType("varchar(255)");

            builder.Property(f => f.CreatedAt)
                .HasColumnName("created_at")
                .IsRequired();

            builder.Property(f => f.UpdatedAt)
                .HasColumnName("updated_at")
                .IsRequired();

            builder.HasOne(f => f.Author)
                .WithMany(u => u.Files)
                .HasForeignKey(f => f.AuthorId)
                .HasConstraintName("fk_files_users_author_id")
                .OnDelete(DeleteBehavior.Restrict);

            //builder.HasOne(f => f.Template)
            //    .WithOne(t => t.File)
            //    .HasForeignKey<Template>(t => t.FileId)
            //    .HasConstraintName("fk_template_file")
            //    .OnDelete(DeleteBehavior.Cascade);

            //builder.HasOne(f => f.Report)
            //    .WithOne(r => r.File)
            //    .HasForeignKey<Report>(r => r.FileId)
            //    .HasConstraintName("fk_report_file")
            //    .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(f => f.AuthorId)
                .HasDatabaseName("idx_files_author_id");
        }
    }
}
