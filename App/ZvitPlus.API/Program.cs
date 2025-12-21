using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System.Text.Json;
using System.Text.Json.Serialization;
using ZvitPlus.BLL.Mappings;
using ZvitPlus.BLL.Services.Implementations;
using ZvitPlus.BLL.Services.Interfaces;
using ZvitPlus.DAL.Context;
using ZvitPlus.BLL.Helpers;
using ZvitPlus.DAL.Repositories.Implementations;
using ZvitPlus.DAL.Repositories.Interfaces;

// Builder
var builder = WebApplication.CreateBuilder(args);

// DBConnection
builder.Services.AddDbContext<ZvitPlusDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// JWT
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
builder.Services.Configure<JwtSettings>(jwtSettings);
builder.Services.AddSingleton<ITokenGenerator, TokenGenerator>();

// Automapper
builder.Services.AddAutoMapper(typeof(AuthProfile));

// Repository
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// Service
builder.Services.AddScoped<IAuthService, AuthService>();



builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter(
            JsonNamingPolicy.CamelCase,
            allowIntegerValues: false));
    });

if (builder.Environment.IsDevelopment())
{
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();
}

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors();
app.UseAuthorization();
app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ZvitPlusDbContext>();
    await dbContext.Database.EnsureCreatedAsync();
}

app.Run();