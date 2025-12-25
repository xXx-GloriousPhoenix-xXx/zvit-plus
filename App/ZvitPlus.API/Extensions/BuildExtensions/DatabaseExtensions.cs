using Microsoft.EntityFrameworkCore;
using ZvitPlus.DAL.Context;

namespace ZvitPlus.API.Extensions.BuildExtensions
{
    public static class DatabaseExtensions
    {
        public static IServiceCollection AddDatabase(
            this IServiceCollection services,
            IConfiguration configuration
            )
        {
            services.AddDbContext<ZvitPlusDbContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

            return services;
        }
    }
}
