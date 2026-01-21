using AutoMapper;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Text;
using ZvitPlus.BLL.Context;
using ZvitPlus.BLL.DTOs.UserDTOs;
using ZvitPlus.BLL.Services.Interfaces;
using ZvitPlus.BLL.Services.Logging;
using ZvitPlus.DAL.Models.Entities;
using ZvitPlus.DAL.Models.Enums;
using ZvitPlus.DAL.Repositories.Interfaces;
using ZvitPlus.BLL.Services.Exceptions;

namespace ZvitPlus.BLL.Services.Implementations
{
    public class UserService(IUnitOfWork unitOfWork, IMapper mapper, ILogger<UserService> logger) : IUserService
    {
        private readonly IUnitOfWork _unitOfWork = unitOfWork;
        private readonly IMapper _mapper = mapper;
        private readonly ILogger<UserService> _logger = logger;

        public async Task<GetUserDTO> BanAsync(Guid userId, bool isBan, UserContext context, CancellationToken ct = default)
        {
            var operationName = (isBan ? "блокування" : "розблокування") + " користувача";
            AppLogger.LogActionStarted(_logger, operationName, userId);

            var user = await _unitOfWork.Users.GetByIdAsync(userId, ct);
            if (user is null)
            {
                AppLogger.LogActionFailed(_logger, operationName, userId);
                throw new BusinessException("Користувача не знайдено");
            }
            if (context.UserId == userId)
            {
                AppLogger.LogActionFailed(_logger, operationName, userId);
                throw new BusinessException("Неможливо виконати операцію для себе");
            }

            if (context.Role > user.Role)
            {
                user.IsBanned = isBan;

                await _unitOfWork.BeginTransactionAsync(ct);
                try
                {
                    _unitOfWork.Users.Update(user);
                    await _unitOfWork.CompleteAsync(ct);
                    await _unitOfWork.CommitTransactionAsync(ct);
                    AppLogger.LogActionCompleted(_logger, operationName, userId);
                }
                catch
                {
                    await _unitOfWork.RollbackTransactionAsync(ct);
                    AppLogger.LogActionFailed(_logger, operationName, userId);
                }
            }
            else
            {
                AppLogger.LogAccessDenied(_logger, context.UserId);
            }

            return _mapper.Map<GetUserDTO>(user);
        }

        public async Task<GetUserDTO> GrantRoleAsync(Guid userId, UserRole role, UserContext context, CancellationToken ct = default)
        {
            var operationName = "надання ролі користувачу";
            AppLogger.LogActionStarted(_logger, operationName, userId);

            var user = await _unitOfWork.Users.GetByIdAsync(userId, ct);
            if (user is null)
            {
                AppLogger.LogActionFailed(_logger, operationName, userId);
                throw new BusinessException("Користувача не знайдено");
            }
            if (context.UserId == userId)
            {
                AppLogger.LogActionFailed(_logger, operationName, userId);
                throw new BusinessException("Неможливо виконати операцію для себе");
            }

            if (context.Role == UserRole.Admin && role < context.Role)
            {
                user.Role = role;

                await _unitOfWork.BeginTransactionAsync(ct);
                try
                {
                    _unitOfWork.Users.Update(user);
                    await _unitOfWork.CompleteAsync(ct);
                    await _unitOfWork.CommitTransactionAsync(ct);
                    AppLogger.LogActionCompleted(_logger, operationName, userId);
                }
                catch
                {
                    await _unitOfWork.RollbackTransactionAsync(ct);
                    AppLogger.LogActionFailed(_logger, operationName, userId);
                }
            }
            else
            {
                AppLogger.LogAccessDenied(_logger, context.UserId);
            }

            return _mapper.Map<GetUserDTO>(user);
        }
    
        public async Task<GetUserDTO?> GetByLoginAsync(string userName, CancellationToken ct = default)
        {
            var result = await _unitOfWork.Users.GetByLoginAsync(userName, ct);
            return _mapper.Map<GetUserDTO>(result);
        }
    }
}
