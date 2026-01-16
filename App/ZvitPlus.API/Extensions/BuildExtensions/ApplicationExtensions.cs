using ZvitPlus.BLL.Helpers;
using ZvitPlus.BLL.Mappings;
using ZvitPlus.BLL.Services.Implementations;
using ZvitPlus.BLL.Services.Interfaces;
using ZvitPlus.DAL.Context.DataFactory;
using ZvitPlus.DAL.Repositories.Implementations;
using ZvitPlus.DAL.Repositories.Interfaces;

namespace ZvitPlus.API.Extensions.BuildExtensions
{
    public static class ApplicationExtensions
    {
        public static IServiceCollection AddApplicationServices(
            this IServiceCollection services)
        {
            services.AddAutoMapper(typeof(AuthProfile));
            services.AddAutoMapper(typeof(UserProfile));
            services.AddAutoMapper(typeof(FileProfile));
            services.AddAutoMapper(typeof(TemplateTypeProfile));

            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IFileService, FileService>();
            services.AddScoped<IReportService, ReportService>();
            services.AddScoped<ITemplateService, TemplateService>();
            services.AddScoped<ITemplateTypeService, TemplateTypeService>();
            services.AddScoped<IStatsService, StatsService>();

            services.AddSingleton<ITokenGenerator, TokenGenerator>();

            services.AddScoped<IDataFactory, DataFactory>();

            return services;
        }
    }
}
