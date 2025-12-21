using System;
using System.Collections.Generic;
using System.Text;
using ZvitPlus.BLL.Services.Interfaces;
using ZvitPlus.DAL.Models.Entities;
using ZvitPlus.DAL.Repositories.Interfaces;

namespace ZvitPlus.BLL.Services.Implementations
{
    public class UserService(IUnitOfWork unitOfWork) : IUserService
    {
        private readonly IUnitOfWork _unitOfWork = unitOfWork;
        public async Task<IEnumerable<User>> GetAllAsync(CancellationToken ct = default)
        {
            return await _unitOfWork.Users.GetAllAsync(ct);
        }
    }
}
