using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ZvitPlus.DAL.Models.Entities;

namespace ZvitPlus.DAL.Context.Configuration
{
    public class RefreshTokenConfiguration : BaseEntityConfiguration<RefreshToken>
    {
        public override void Configure(EntityTypeBuilder<RefreshToken> builder)
        {
            base.Configure(builder);

            builder.ToTable("refresh_tokens");

            builder.Property(rf => rf.Token)
                .HasColumnName("token")
                .HasColumnType("varchar(512)")
                .HasMaxLength(512)
                .IsRequired();

            builder.Property(rf => rf.CreatedAt)
                .HasColumnName("created_at")
                .HasColumnType("datetime")
                .IsRequired();

            builder.Property(rf => rf.ExpiresAt)
                .HasColumnName("expires_at")
                .HasColumnType("datetime")
                .IsRequired();

            builder.Property(rf => rf.IsRevoked)
                .HasColumnName("is_revoked")
                .HasColumnType("bit")
                .HasDefaultValue(false)
                .IsRequired();

            // RefreshToken - User (N : 1)
            builder.HasOne(rf => rf.User)
                .WithMany(u => u.RefreshToken)
                .HasForeignKey(rf => rf.UserId)
                .HasConstraintName("fk_refresh_tokens_users_user_id")
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();
        }
    }
}
