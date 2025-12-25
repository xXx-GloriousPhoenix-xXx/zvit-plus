using ZvitPlus.DAL.Context;

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
    }
}
