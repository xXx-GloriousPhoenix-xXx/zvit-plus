using ZvitPlus.BLL.DTOs.AuthDTOs;
using ZvitPlus.BLL.Services.Interfaces;
using ZvitPlus.DAL.Repositories.Interfaces;
using AutoMapper;
using Microsoft.Extensions.Logging;
using ZvitPlus.BLL.Services.Exceptions;
using ZvitPlus.DAL.Models.Entities;
using static BCrypt.Net.BCrypt;
using ZvitPlus.BLL.Helpers;

namespace ZvitPlus.BLL.Services.Implementations
{
    public partial class AuthService(IUnitOfWork unitOfWork, IMapper mapper, ILogger<AuthService> logger, ITokenGenerator tokenGenerator) : IAuthService
    {
        private readonly IUnitOfWork _unitOfWork = unitOfWork;
        private readonly IMapper _mapper = mapper;
        private readonly ILogger<AuthService> _logger = logger;
        private readonly ITokenGenerator _tokenGenerator = tokenGenerator;

        [LoggerMessage(
            Level = LogLevel.Information,
            Message = "Створено нового користувача (id: {UserId})")]
        private partial void LogUserCreated(Guid userId);

        [LoggerMessage(
            Level = LogLevel.Information,
            Message = "Створення нового користувача...")]
        private partial void LogUserCreationStarted();

        [LoggerMessage(
            Level = LogLevel.Error,
            Message = "Помилка створення користувача")]
        private partial void LogUserCreationFailed();

        [LoggerMessage(
            Level = LogLevel.Information,
            Message = "Спроба авторизації користувача ({ParamName}: {ParamValue})")]
        private partial void LogUserLoginAttempted(string paramName, string paramValue);

        [LoggerMessage(
            Level = LogLevel.Warning,
            Message = "Помилка авторизації користувача (id: {UserId})")]
        private partial void LogUserLoginFailed(Guid userId);

        [LoggerMessage(
            Level = LogLevel.Warning,
            Message = "Помилка авторизації користувача ({ParamName}: {ParamValue})")]
        private partial void LogUserLoginFailed(string paramName, string paramValue);

        [LoggerMessage(
            Level = LogLevel.Information,
            Message = "Користувача успішно авторизовано (id: {UserId})")]
        private partial void LogUserLoginSucceed(Guid userId);

        /// <summary>
        /// Creates a new user and refresh token
        /// </summary>
        /// <param name="dto">Registration information</param>
        /// <param name="ct">Default cancellation token value</param>
        /// <returns>Nothing</returns>
        /// <exception cref="BusinessException">User exists, Wrong password</exception>
        public async Task RegisterAsync(RegisterDTO dto, CancellationToken ct = default)
        {
            LogUserCreationStarted();

            var userExists = await _unitOfWork.Users.ExistsAsync(
                u => u.Login == dto.Login || u.Email == dto.Email, ct);

            if (userExists)
            {
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

                LogUserCreated(user.Id);
            }
            catch
            {
                await _unitOfWork.RollbackTransactionAsync(ct);
                LogUserCreationFailed();
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
                LogUserLoginAttempted("email", email);

                user = await _unitOfWork.Users.GetByEmailAsync(email, ct);
                if (user is null)
                {
                    LogUserLoginFailed("email", email);
                    throw new NotFoundException("Користувача не знайдено");
                }
            }
            else
            {
                var login = dto.LoginOrEmail;
                LogUserLoginAttempted("login", login);

                user = await _unitOfWork.Users.GetByLoginAsync(login, ct);
                if (user is null)
                {
                    LogUserLoginFailed("login", login);
                    throw new NotFoundException("Користувача не знайдено");
                }
            }

            if (user.IsBanned)
            {
                LogUserLoginFailed(user.Id);
                throw new AccessException("Користувача заблоковано");
            }

            var result = Verify(dto.Password, user.Password);
            if (!result)
            {
                LogUserLoginFailed(user.Id);
                throw new LoginException("Введено невірний пароль");
            }

            LogUserLoginSucceed(user.Id);

            var refreshToken = _tokenGenerator.GenerateRefreshToken();
            var tokenDto = new TokenDTO
            {
                AccessToken = _tokenGenerator.GenerateAccessToken(user),
                RefreshToken = refreshToken,
                ExpiresIn = _tokenGenerator.AccessExpiresInMinutes
            };
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
            }
            catch
            {
                await _unitOfWork.RollbackTransactionAsync(ct);
                LogUserLoginFailed(user.Id);
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
                throw new BusinessException("Токен не знайдно");
            }
            else if (token.ExpiresAt > DateTime.UtcNow)
            {
                throw new BusinessException("Строк дії токену завершився");
            }
            else if (token.IsRevoked)
            {
                throw new BusinessException("Токен скасовано");
            }

            token.IsRevoked = true;

            await _unitOfWork.BeginTransactionAsync(ct);
            try
            {
                _unitOfWork.RefreshTokens.Update(token);
                await _unitOfWork.CompleteAsync(ct);
                await _unitOfWork.CommitTransactionAsync(ct);
            }
            catch
            {
                await _unitOfWork.RollbackTransactionAsync(ct);
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
                throw new BusinessException("Невалідний refresh токен");
            }

            var user = await _unitOfWork.Users.GetByIdAsync(currentRefreshToken.UserId, ct);
            if (user is null)
            {
                throw new BusinessException("Користувач не знайдений");
            }
            if (user.IsBanned)
            {
                throw new AccessException("Користувач заблокований");
            }

            var newAccessToken = _tokenGenerator.GenerateAccessToken(user);

            var tokenDto = new TokenDTO
            {
                AccessToken = newAccessToken,
                RefreshToken = refreshToken,
                ExpiresIn = _tokenGenerator.AccessExpiresInMinutes
            };

            return tokenDto;
        }
    }
}
