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
                .HasColumnType("varchar(24)")
                .HasMaxLength(24)
                .IsRequired();

            builder.Property(u => u.Email)
                .HasColumnName("email")
                .HasColumnType("varchar(64)")
                .HasMaxLength(64)
                .IsRequired();

            builder.Property(u => u.Password)
                .HasColumnName("password")
                .HasColumnType("varchar(128)")
                .HasMaxLength(128)
                .IsRequired();

            builder.Property(u => u.Role)
                .HasColumnName("role")
                .HasColumnType("varchar(16)")
                .HasMaxLength(16)
                .HasConversion<string>()
                .IsRequired();

            builder.Property(u => u.IsBanned)
                .HasColumnName("is_banned")
                .HasColumnType("bit")
                .HasDefaultValue(false)
                .IsRequired();

            builder.Property(u => u.CreatedAt)
                .HasColumnName("created_at")
                .HasColumnType("datetime")
                .IsRequired();

            builder.Property(u => u.UpdatedAt)
                .HasColumnName("updated_at")
                .HasColumnType("datetime")
                .IsRequired();

            builder.HasIndex(u => u.Login)
                .HasDatabaseName("idx_users_login")
                .IsUnique();

            builder.HasIndex(u => u.Email)
                .HasDatabaseName("idx_users_email")
                .IsUnique();
        }
    }
}
