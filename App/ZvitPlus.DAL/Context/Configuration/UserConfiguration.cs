using ZvitPlus.DAL.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ZvitPlus.DAL.Context.Configuration
{
    public class UserConfiguration : BaseEntityConfiguration<User>
    {
        public override void Configure(EntityTypeBuilder<User> builder)
        {
            base.Configure(builder);

            builder.ToTable("users");

            builder.Property(u => u.Login)
                .HasColumnName("login")
                .IsRequired()
                .HasMaxLength(64)
                .HasColumnType("varchar(64)");

            builder.Property(u => u.Email)
                .HasColumnName("email")
                .IsRequired()
                .HasMaxLength(64)
                .HasColumnType("varchar(64)");

            builder.Property(u => u.Password)
                .HasColumnName("password")
                .IsRequired()
                .HasMaxLength(128)
                .HasColumnType("varchar(128)");

            builder.Property(u => u.Role)
                .HasColumnName("role")
                .IsRequired()
                .HasConversion<string>()
                .HasMaxLength(16)
                .HasColumnType("varchar(16)");

            builder.Property(u => u.IsBanned)
                .HasColumnName("is_banned")
                .HasDefaultValue(false);

            builder.Property(u => u.CreatedAt)
                .HasColumnName("created_at")
                .IsRequired();

            builder.Property(u => u.UpdatedAt)
                .HasColumnName("updated_at")
                .IsRequired();

            //builder.HasMany(u => u.Files)
            //    .WithOne(f => f.Author)
            //    .HasForeignKey(f => f.AuthorId)
            //    .HasConstraintName("fk_file_author")
            //    .OnDelete(DeleteBehavior.Restrict);

            builder.HasIndex(u => u.Login)
                .HasDatabaseName("idx_users_login")
                .IsUnique();

            builder.HasIndex(u => u.Email)
                .HasDatabaseName("idx_users_email")
                .IsUnique();
        }
    }
}
