using Microsoft.OpenApi;

namespace ZvitPlus.API.Extensions.BuildExtensions
{
    public static class SwaggerExtensions
    {
        public static IServiceCollection AddSwaggerWithJwt(
            this IServiceCollection services,
            IHostEnvironment environment)
        {
            if (!environment.IsDevelopment())
                return services;

            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen(options =>
            {
                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Type = SecuritySchemeType.Http,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Name = "Authorization"
                });

                options.OperationFilter<AuthorizeOperationFilter>();
            });

            return services;
        }
    }
}
