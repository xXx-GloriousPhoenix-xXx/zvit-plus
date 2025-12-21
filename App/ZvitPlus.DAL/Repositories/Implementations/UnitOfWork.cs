using Microsoft.EntityFrameworkCore.Storage;
using ZvitPlus.DAL.Context;
using ZvitPlus.DAL.Models.Entities;
using ZvitPlus.DAL.Repositories.Interfaces;

namespace ZvitPlus.DAL.Repositories.Implementations
{
    public class UnitOfWork(ZvitPlusDbContext context) : IUnitOfWork
    {
        private readonly ZvitPlusDbContext _context = context;
        private IDbContextTransaction? _currentTransaction;

        private IUserRepository? _users;
        private IBaseRepository<FileEntity>? _files;
        private IBaseRepository<TemplateType>? _templateTypes;
        private IBaseRepository<Template>? _templates;
        private IBaseRepository<Report>? _reports;
        private IRefreshTokenRepository? _refreshTokens;

        public IUserRepository Users =>
            _users ??= new UserRepository(_context);

        public IBaseRepository<FileEntity> Files =>
            _files ??= new BaseRepository<FileEntity>(_context);

        public IBaseRepository<TemplateType> TemplateTypes =>
            _templateTypes ??= new BaseRepository<TemplateType>(_context);

        public IBaseRepository<Template> Templates =>
            _templates ??= new BaseRepository<Template>(_context);

        public IBaseRepository<Report> Reports =>
            _reports ??= new BaseRepository<Report>(_context);

        public IRefreshTokenRepository RefreshTokens =>
            _refreshTokens ??= new RefreshTokenRepository(_context);
        public async Task<int> CompleteAsync(CancellationToken ct = default)
        {
            return await _context.SaveChangesAsync(ct);
        }

        public async Task BeginTransactionAsync(CancellationToken ct = default)
        {
            _currentTransaction = await _context.Database.BeginTransactionAsync(ct);
        }

        public async Task CommitTransactionAsync(CancellationToken ct = default)
        {
            if (_currentTransaction == null)
                throw new InvalidOperationException("No active transaction");

            await _currentTransaction.CommitAsync(ct);
            await _currentTransaction.DisposeAsync();
            _currentTransaction = null;
        }

        public async Task RollbackTransactionAsync(CancellationToken ct = default)
        {
            if (_currentTransaction == null)
                throw new InvalidOperationException("No active transaction");

            await _currentTransaction.RollbackAsync(ct);
            await _currentTransaction.DisposeAsync();
            _currentTransaction = null;
        }

        private bool _disposed = false;

        protected virtual void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                if (disposing)
                {
                    _context.Dispose();
                    _currentTransaction?.Dispose();
                }
                _disposed = true;
            }
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        public async ValueTask DisposeAsync()
        {
            if (_currentTransaction != null)
            {
                await _currentTransaction.DisposeAsync();
            }
            await _context.DisposeAsync();
            Dispose(false);
            GC.SuppressFinalize(this);
        }
    }
}
