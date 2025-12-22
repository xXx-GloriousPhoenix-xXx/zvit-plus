using System.Text.Json;
using System.Text.Json.Serialization;

namespace ZvitPlus.API.Extensions
{
    public static class ControllerExtensions
    {
        public static IServiceCollection AddControllersWithJson(
            this IServiceCollection services)
        {
            services.AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.Converters.Add(
                        new JsonStringEnumConverter(
                            JsonNamingPolicy.CamelCase,
                            allowIntegerValues: false));
                });

            return services;
        }
    }
}
