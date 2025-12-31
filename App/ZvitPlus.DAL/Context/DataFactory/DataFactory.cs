using Microsoft.Extensions.Configuration;
using System.Data;
using System.Reflection;
using ZvitPlus.DAL.Models.Entities;
using ZvitPlus.DAL.Models.Enums;
using ZvitPlus.DAL.Repositories.Implementations;
using ZvitPlus.DAL.Repositories.Interfaces;
using static BCrypt.Net.BCrypt;

namespace ZvitPlus.DAL.Context.DataFactory
{
    public class DataFactory(IUnitOfWork unitOfWork, IConfiguration configuration) : IDataFactory
    {
        private readonly IUnitOfWork _unitOfWork = unitOfWork;
        private readonly string _basePath = configuration["DataStorage:BasePath"]!;
        public async Task InitializeAsync(CancellationToken ct = default)
        {
            //await ClearEntitiesAsync(ct);
            //await InitializeUsersAsync(ct);
            //await InitializeTemplateTypesAsync(ct);
        }
        private async Task InitializeUsersAsync(CancellationToken ct = default)
        {
            var users = new List<User>()
            {
                new()
                {
                    Id = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-000000000000"),
                    Login = "admin",
                    Email = "admin@zvitplus.com",
                    Password = HashPassword("#adminA1"),
                    Role = UserRole.Admin
                }
            };
            for (var i = 0; i < 3; i++)
            {
                users.Add(new()
                {
                    Id = Guid.Parse($"bbbbbbbb-bbbb-bbbb-bbbb-00000000000{i}"),
                    Login = $"mod{i + 1}",
                    Email = $"mod{i + 1}@zvitplus.com",
                    Password = HashPassword($"#modB{i + 1}"),
                    Role = UserRole.Mod
                });
                users.Add(new()
                {
                    Id = Guid.Parse($"cccccccc-cccc-cccc-cccc-00000000000{i}"),
                    Login = $"user{i + 1}",
                    Email = $"user{i + 1}@zvitplus.com",
                    Password = HashPassword($"#userC{i + 1}"),
                    Role = UserRole.User
                });
            }

            await _unitOfWork.BeginTransactionAsync(ct);
            try
            {
                _unitOfWork.Users.AddRange(users);
                await _unitOfWork.CompleteAsync(ct);
                await _unitOfWork.CommitTransactionAsync(ct);
            }
            catch
            {
                await _unitOfWork.RollbackTransactionAsync(ct);
                throw new Exception("Помилка додавання користувачів");
            }
        }
        private async Task InitializeTemplateTypesAsync(CancellationToken ct = default)
        {
            var templateTypes = new List<TemplateType>()
            {
                new() { Name = "Invoice" },
                new() { Name = "Contract" },
                new() { Name = "Report" },
                new() { Name = "Letter" },
                new() { Name = "Form" },
                new() { Name = "Certificate" }
            };

            await _unitOfWork.BeginTransactionAsync(ct);
            try
            {
                _unitOfWork.TemplateTypes.AddRange(templateTypes);
                await _unitOfWork.CompleteAsync(ct);
                await _unitOfWork.CommitTransactionAsync(ct);
            }
            catch
            {
                await _unitOfWork.RollbackTransactionAsync(ct);
                throw new Exception("Помилка додавання типів шаблонів");
            }
        }
        private async Task ClearEntitiesAsync(CancellationToken ct = default)
        {
            try
            {
                var refreshTokens = await _unitOfWork.RefreshTokens.GetAllAsync(ct);
                if (refreshTokens.Any())
                {
                    _unitOfWork.RefreshTokens.DeleteRange(refreshTokens);
                }

                var reports = await _unitOfWork.Reports.GetAllAsync(ct);
                if (reports.Any())
                {
                    _unitOfWork.Reports.DeleteRange(reports);
                }

                var templates = await _unitOfWork.Templates.GetAllAsync(ct);
                if (templates.Any())
                {
                    _unitOfWork.Templates.DeleteRange(templates);
                }

                var fileEntities = await _unitOfWork.Files.GetAllAsync(ct);
                if (fileEntities.Any())
                {
                    _unitOfWork.Files.DeleteRange(fileEntities);
                }

                if (Directory.Exists(_basePath))
                {
                    var dirs = Directory.GetDirectories(_basePath);
                    foreach (var dir in dirs)
                    {
                        Directory.Delete(dir, true);
                    }
                }

                var templateTypes = await _unitOfWork.TemplateTypes.GetAllAsync(ct);
                if (templateTypes.Any())
                {
                    _unitOfWork.TemplateTypes.DeleteRange(templateTypes);
                }

                var users = await _unitOfWork.Users.GetAllAsync(ct);
                if (users.Any())
                {
                    _unitOfWork.Users.DeleteRange(users);
                }

                await _unitOfWork.BeginTransactionAsync(ct);
                try
                {
                    await _unitOfWork.CompleteAsync(ct);
                    await _unitOfWork.CommitTransactionAsync(ct);
                }
                catch
                {
                    await _unitOfWork.RollbackTransactionAsync(ct);
                    throw;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Помилка очищення бази даних: {ex.Message}", ex);
            }
        }
    }
}
