using Microsoft.Extensions.Logging;
using ZvitPlus.DAL.Models.Entities;

namespace ZvitPlus.BLL.Services.Logging
{
    public static partial class AppLogger
    {
        [LoggerMessage(Level = LogLevel.Information, Message = "[+] {Entity} (id: {Id})")]
        public static partial void LogEntityCreated(ILogger logger, string entity, Guid id);

        [LoggerMessage(Level = LogLevel.Information, Message = "[~] {Entity} (id: {Id})")]
        public static partial void LogEntityUpdated(ILogger logger, string entity, Guid id);

        [LoggerMessage(Level = LogLevel.Information, Message = "[-] {Entity} (id: {Id})")]
        public static partial void LogEntityDeleted(ILogger logger, string entity, Guid id);

        [LoggerMessage(Level = LogLevel.Information, Message = "[>] Почато {Action}...")]
        public static partial void LogActionStarted(ILogger logger, string action);

        [LoggerMessage(Level = LogLevel.Information, Message = "[>] Почато {Action} (id: {Id})...")]
        public static partial void LogActionStarted(ILogger logger, string action, Guid id);

        [LoggerMessage(Level = LogLevel.Information, Message = "[v] {Action} завершено")]
        public static partial void LogActionCompleted(ILogger logger, string action);

        [LoggerMessage(Level = LogLevel.Information, Message = "[v] {Action} завершено (id: {Id})")]
        public static partial void LogActionCompleted(ILogger logger, string action, Guid id);

        [LoggerMessage(Level = LogLevel.Error, Message = "[x] Помилка {Action}")]
        public static partial void LogActionFailed(ILogger logger, string action);

        [LoggerMessage(Level = LogLevel.Error, Message = "[x] Помилка {Action} (id: {Id})")]
        public static partial void LogActionFailed(ILogger logger, string action, Guid id);

        [LoggerMessage(Level = LogLevel.Information, Message = "[x] Помилка {Action} ({ParamName}: {ParamValue})")]
        public static partial void LogActionFailed(ILogger logger, string action, string paramName, string paramValue);

        [LoggerMessage(Level = LogLevel.Warning, Message = "[!] Відмовлено в доступі (id: {Id})")]
        public static partial void LogAccessDenied(ILogger logger, Guid id);


        public static void LogUserLogin(ILogger logger, Guid userId) => LogActionCompleted(logger, "вхід у систему", userId);

        [LoggerMessage(Level = LogLevel.Information, Message = "[->] Спроба входу ({Parameter}: {Value})")]
        public static partial void LogUserLoginAttempt(ILogger logger, string parameter, string value);

        public static void LogUserLoginFailed(ILogger logger, Guid userId) => LogActionFailed(logger, "входу у систему", userId);

        [LoggerMessage(Level = LogLevel.Warning, Message = "[->] Невдала спроба входу ({Parameter}: {Value})")]
        public static partial void LogUserLoginFailed(ILogger logger, string parameter, string value);

        public static void LogUserLogout(ILogger logger, Guid userId) => LogActionCompleted(logger, "вихід із системи", userId);

        public static void LogUserLogoutFailed(ILogger logger, Guid userId) => LogActionFailed(logger, "виходу із системи", userId);
    }
}