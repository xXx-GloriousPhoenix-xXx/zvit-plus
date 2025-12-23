using System;
using System.Collections.Generic;
using System.Text;
using ZvitPlus.BLL.DTOs.UserDTOs;
using ZvitPlus.BLL.Services.Interfaces;
using ZvitPlus.DAL.Models.Entities;
using ZvitPlus.DAL.Models.Enums;
using ZvitPlus.DAL.Repositories.Interfaces;

namespace ZvitPlus.BLL.Services.Implementations
{
    public class UserService(IUnitOfWork unitOfWork) : IUserService
    {
        private readonly IUnitOfWork _unitOfWork = unitOfWork;

        public Task<GetUserDTO> BanAsync(Guid userId, bool isBan, CancellationToken ct = default)
        {
            throw new NotImplementedException();
        }

        public Task<GetUserDTO> GrantRoleAsync(Guid userId, UserRole role, CancellationToken ct = default)
        {
            throw new NotImplementedException();
        }
    }
}
