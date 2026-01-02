using Scalar.AspNetCore;
using ZvitPlus.DAL.Context;
using ZvitPlus.DAL.Context.DataFactory;

namespace ZvitPlus.API.Extensions.BuildExtensions
{
    public static class ApplicationBuilderExtensions
    {
        public static WebApplication UseSwaggerIfDevelopment(
            this WebApplication app)
        {
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
                app.MapScalarApiReference(options =>
                {
                    options
                        .WithTitle("Zvit+ API")
                        .WithOpenApiRoutePattern("/swagger/{documentName}/swagger.json");
                });
            }

            return app;
        }

        public static WebApplication EnsureDatabaseCreated(
            this WebApplication app)
        {
            using var scope = app.Services.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<ZvitPlusDbContext>();
            db.Database.EnsureCreated();
            return app;
        }

        public async static Task<WebApplication> SeedTestData(
            this WebApplication app)
        {
            if (app.Environment.IsDevelopment())
            {
                using var scope = app.Services.CreateScope();
                var dataFactory = scope.ServiceProvider.GetRequiredService<IDataFactory>();
                await dataFactory.InitializeAsync();
            }

            return app;
        }
    }
}
