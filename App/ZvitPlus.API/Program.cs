using ZvitPlus.API.Extensions.AuthorizationExtensions;
using ZvitPlus.API.Extensions.BuildExtensions;

var builder = WebApplication.CreateBuilder(args);

// Infrastructure
builder.Services.AddDatabase(builder.Configuration);
builder.Services.AddJwtAuthentication(builder.Configuration);
builder.Services.AddAuthorizationPolicies();
builder.Services.AddApplicationServices();
builder.Services.AddSwaggerWithJwt(builder.Environment);
builder.Services.AddCorsPolicy();
builder.Services.AddControllersWithJson();

// App
var app = builder.Build();

app.UseSwaggerIfDevelopment();
app.UseHttpsRedirection();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.EnsureDatabaseCreated();
await app.SeedTestData();

app.Run();
