using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using ZvitPlus.API.Context.Implementations;
using ZvitPlus.API.Context.Interfaces;
using ZvitPlus.DAL.Models.Enums;

namespace ZvitPlus.API.Extensions.AuthorizationExtensions
{
    public static class AuthorizationExtensions
    {
        public static IServiceCollection AddAuthorizationPolicies(
            this IServiceCollection services)
        {
            services.AddHttpContextAccessor();
            services.AddScoped<IUserContextFactory, UserContextFactory>();

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
