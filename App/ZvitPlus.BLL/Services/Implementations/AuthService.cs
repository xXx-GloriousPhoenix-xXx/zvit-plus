using AutoMapper;
using Azure.Core;
using Microsoft.Extensions.Logging;
using ZvitPlus.BLL.DTOs.AuthDTOs;
using ZvitPlus.BLL.Helpers;
using ZvitPlus.BLL.Services.Exceptions;
using ZvitPlus.BLL.Services.Interfaces;
using ZvitPlus.DAL.Models.Entities;
using ZvitPlus.DAL.Repositories.Interfaces;
using static BCrypt.Net.BCrypt;
using ZvitPlus.BLL.Services.Logging;

namespace ZvitPlus.BLL.Services.Implementations
{
    public partial class AuthService(IUnitOfWork unitOfWork, IMapper mapper, ILogger<AuthService> logger, ITokenGenerator tokenGenerator) : IAuthService
    {
        private readonly IUnitOfWork _unitOfWork = unitOfWork;
        private readonly IMapper _mapper = mapper;
        private readonly ILogger<AuthService> _logger = logger;
        private readonly ITokenGenerator _tokenGenerator = tokenGenerator;

        /// <summary>
        /// Creates a new user and refresh token
        /// </summary>
        /// <param name="dto">Registration information</param>
        /// <param name="ct">Default cancellation token value</param>
        /// <returns>Nothing</returns>
        /// <exception cref="BusinessException">User exists, Wrong password</exception>
        public async Task RegisterAsync(RegisterDTO dto, CancellationToken ct = default)
        {
            AppLogger.LogActionStarted(_logger, "Створення користувача");

            var userExists = await _unitOfWork.Users.ExistsAsync(
                u => u.Login == dto.Login || u.Email == dto.Email, ct);

            if (userExists)
            {
                AppLogger.LogActionFailed(logger, "Користувач вже існує",
                    dto.Login is null ? "login" : "email",
                    dto.Login ?? dto.Email);
                throw new BusinessException("Користувач з таким логіном або поштою вже існує");
            }

            var user = _mapper.Map<User>(dto);
            var passwordHash = HashPassword(dto.Password);
            user.Password = passwordHash;

            var refreshToken = new RefreshToken
            {
                Token = _tokenGenerator.GenerateRefreshToken(),
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddDays(_tokenGenerator.RefreshExpiresInDays),
                IsRevoked = false,
                User = user
            };

            await _unitOfWork.BeginTransactionAsync(ct);
            try
            {
                _unitOfWork.Users.Add(user);
                _unitOfWork.RefreshTokens.Add(refreshToken);
                await _unitOfWork.CompleteAsync(ct);
                await _unitOfWork.CommitTransactionAsync(ct);
                AppLogger.LogEntityCreated(_logger, "Токен", refreshToken.Id);
                AppLogger.LogEntityCreated(_logger, "Користувач", user.Id);
            }
            catch
            {
                await _unitOfWork.RollbackTransactionAsync(ct);
                AppLogger.LogActionFailed(_logger, "створення користувача");
                throw new BusinessException("Помилка реєстрації");
            }   
        }

        /// <summary>
        /// Authorizes user. Creates new refresh token
        /// </summary>
        /// <param name="dto">Login data</param>
        /// <param name="ct">Cancellation token</param>
        /// <returns>Token</returns>
        /// <exception cref="NotFoundException"></exception>
        /// <exception cref="AccessException"></exception>
        /// <exception cref="LoginException"></exception>
        public async Task<TokenDTO> LoginAsync(LoginDTO dto, CancellationToken ct = default)
        {
            User? user;
            if (dto.LoginOrEmail.Contains('@'))
            {
                var email = dto.LoginOrEmail;
                AppLogger.LogUserLoginAttempt(_logger, "email", email);

                user = await _unitOfWork.Users.GetByEmailAsync(email, ct);
                if (user is null)
                {
                    AppLogger.LogUserLoginFailed(_logger, "email", email);
                    throw new NotFoundException("Користувача не знайдено");
                }
            }
            else
            {
                var login = dto.LoginOrEmail;
                AppLogger.LogUserLoginAttempt(_logger, "login", login);

                user = await _unitOfWork.Users.GetByLoginAsync(login, ct);
                if (user is null)
                {
                    AppLogger.LogUserLoginFailed(_logger, "login", login);
                    throw new NotFoundException("Користувача не знайдено");
                }
            }

            if (user.IsBanned)
            {
                AppLogger.LogUserLoginFailed(_logger, user.Id);
                throw new AccessException("Користувача заблоковано");
            }

            var result = Verify(dto.Password, user.Password);
            if (!result)
            {
                AppLogger.LogUserLoginFailed(_logger, user.Id);
                throw new LoginException("Введено невірний пароль");
            }

            var refreshToken = _tokenGenerator.GenerateRefreshToken();
            var tokenDto = new TokenDTO(
                AccessToken: _tokenGenerator.GenerateAccessToken(user),
                RefreshToken: refreshToken,
                ExpiresIn: _tokenGenerator.AccessExpiresInMinutes
            );
            var refreshTokenEntity = new RefreshToken
            {
                Token = refreshToken,
                UserId = user.Id,
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddDays(_tokenGenerator.RefreshExpiresInDays),
                IsRevoked = false
            };

            await _unitOfWork.BeginTransactionAsync(ct);
            try
            {
                _unitOfWork.RefreshTokens.Add(refreshTokenEntity);
                await _unitOfWork.CompleteAsync(ct);
                await _unitOfWork.CommitTransactionAsync(ct);
                AppLogger.LogEntityCreated(_logger, "Refresh токен", refreshTokenEntity.Id);
                AppLogger.LogUserLogin(_logger, user.Id);
            }
            catch
            {
                await _unitOfWork.RollbackTransactionAsync(ct);
                AppLogger.LogUserLoginFailed(_logger, user.Id);
                throw new LoginException("Помилка авторизації");
            }

            return tokenDto;
        }

        /// <summary>
        /// If refresh token is valid - 
        /// </summary>
        /// <param name="refreshToken"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        /// <exception cref="BusinessException"></exception>
        public async Task LogoutAsync(string refreshToken, CancellationToken ct = default)
        {
            var token = await _unitOfWork.RefreshTokens.GetByTokenAsync(refreshToken, ct);
            if (token is null)
            {
                AppLogger.LogActionFailed(_logger, "Refresh токен не знайдно");
                throw new BusinessException("Refresh токен не знайдно");
            }
            else if (token.ExpiresAt < DateTime.UtcNow)
            {
                AppLogger.LogUserLogoutFailed(_logger, token.UserId);
                throw new BusinessException("Строк дії токену завершився");
            }
            else if (token.IsRevoked)
            {
                AppLogger.LogUserLogoutFailed(_logger, token.UserId);
                throw new BusinessException("Refresh токен скасовано");
            }

            token.IsRevoked = true;

            await _unitOfWork.BeginTransactionAsync(ct);
            try
            {
                _unitOfWork.RefreshTokens.Update(token);
                await _unitOfWork.CompleteAsync(ct);
                await _unitOfWork.CommitTransactionAsync(ct);
                AppLogger.LogUserLogout(_logger, token.UserId);
            }
            catch
            {
                await _unitOfWork.RollbackTransactionAsync(ct);
                AppLogger.LogUserLogoutFailed(_logger, token.UserId);
                throw new BusinessException("Помилка виходу");
            }
        }

        /// <summary>
        /// Automatically generates access token if refresh token has not expired
        /// </summary>
        /// <param name="dto">Refresh data</param>
        /// <param name="ct">Cancellation token</param>
        /// <returns></returns>
        /// <exception cref="BusinessException"></exception>
        /// <exception cref="AccessException"></exception>
        public async Task<TokenDTO> RefreshAsync(string refreshToken, CancellationToken ct = default)
        {
            var currentRefreshToken = await _unitOfWork.RefreshTokens.GetByTokenAsync(refreshToken, ct);
            if (currentRefreshToken is null)
            {
                AppLogger.LogActionFailed(_logger, "Refresh токен не знайдено", "Refresh токен", refreshToken);
                throw new BusinessException("Невалідний refresh токен");
            }

            var user = await _unitOfWork.Users.GetByIdAsync(currentRefreshToken.UserId, ct);
            if (user is null)
            {
                AppLogger.LogActionFailed(_logger, "Користувача не знайдено", currentRefreshToken.UserId);
                throw new BusinessException("Користувач не знайдений");
            }
            if (user.IsBanned)
            {
                AppLogger.LogAccessDenied(_logger, currentRefreshToken.UserId);
                throw new AccessException("Користувач заблокований");
            }

            var newAccessToken = _tokenGenerator.GenerateAccessToken(user);

            var tokenDto = new TokenDTO(
                AccessToken: newAccessToken,
                RefreshToken: refreshToken,
                ExpiresIn: _tokenGenerator.AccessExpiresInMinutes
            );

            return tokenDto;
        }
    }
}
