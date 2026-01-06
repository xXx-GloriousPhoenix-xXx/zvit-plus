namespace ZvitPlus.API.Extensions.BuildExtensions
{
    public static class CorsExtensions
    {
        public static IServiceCollection AddCorsPolicy(
            this IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddDefaultPolicy(policy =>
                    policy.WithOrigins("http://localhost:5173") // Vite
                          .AllowAnyMethod()
                          .AllowAnyHeader()
			  .AllowCredentials()
		);
            });

            return services;
        }
    }
}
