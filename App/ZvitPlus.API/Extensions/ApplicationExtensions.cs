using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using ZvitPlus.BLL.Helpers;
using ZvitPlus.BLL.Mappings;
using ZvitPlus.BLL.Services.Implementations;
using ZvitPlus.BLL.Services.Interfaces;
using ZvitPlus.DAL.Models.Enums;
using ZvitPlus.DAL.Repositories.Implementations;
using ZvitPlus.DAL.Repositories.Interfaces;

namespace ZvitPlus.API.Extensions
{
    public static class ApplicationExtensions
    {
        public static IServiceCollection AddApplicationServices(
            this IServiceCollection services)
        {
            services.AddAutoMapper(typeof(AuthProfile));

            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IRefreshTokenService, RefreshTokenService>();

            services.AddSingleton<ITokenGenerator, TokenGenerator>();

            return services;
        }
    }
    public static class AuthorizationExtensions
    {
        public static IServiceCollection AddAuthorizationPolicies(
            this IServiceCollection services)
        {
            services.AddAuthorizationBuilder()
                .AddPolicy("UserLevel", policy =>
                    policy.RequireAssertion(context =>
                        HasRequiredRole(context, UserRole.User)))
                .AddPolicy("ModLevel", policy =>
                    policy.RequireAssertion(context =>
                        HasRequiredRole(context, UserRole.Mod)))
                .AddPolicy("AdminLevel", policy =>
                    policy.RequireAssertion(context =>
                        HasRequiredRole(context, UserRole.Admin)));

            return services;
        }

        private static bool HasRequiredRole(
            AuthorizationHandlerContext context,
            UserRole requiredRole)
        {
            var roleClaim = context.User.FindFirst(ClaimTypes.Role);
            if (roleClaim is null)
                return false;

            return Enum.TryParse<UserRole>(roleClaim.Value, out var userRole)
                   && userRole >= requiredRole;
        }
    }
}
