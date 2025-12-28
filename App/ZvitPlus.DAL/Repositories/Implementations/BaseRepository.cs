using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using ZvitPlus.DAL.Context;
using ZvitPlus.DAL.Models.Entities;
using ZvitPlus.DAL.Repositories.Interfaces;

namespace ZvitPlus.DAL.Repositories.Implementations
{
    public class BaseRepository<T>(ZvitPlusDbContext context)
        : IBaseRepository<T> where T : BaseEntity
    {
        protected readonly ZvitPlusDbContext _dbContext = context
            ?? throw new ArgumentNullException(nameof(context));
        protected readonly DbSet<T> _dbSet = context.Set<T>();

        public IQueryable<T> AsQueryable() => _dbSet.AsQueryable();

        public async Task<T?> GetByIdAsync(Guid id, CancellationToken ct = default)
        {
            return await _dbSet.FindAsync([id], ct);
        }

        public async Task<T?> GetByIdAsync(
            Guid id,
            CancellationToken ct = default,
            params Expression<Func<T, object?>>[] includes)
        {
            if (includes == null || includes.Length == 0)
            {
                return await GetByIdAsync(id, ct);
            }

            IQueryable<T> query = _dbSet;
            foreach (var include in includes)
            {
                query = query.Include(include);
            }

            return await query.FirstOrDefaultAsync(e => e.Id == id, ct);
        }

        public async Task<IEnumerable<T>> GetAllAsync(CancellationToken ct = default)
        {
            return await _dbSet.ToListAsync(ct);
        }

        public async Task<IEnumerable<T>> FindAsync(
            Expression<Func<T, bool>> predicate,
            CancellationToken ct = default)
        {
            return await _dbSet.Where(predicate).ToListAsync(ct);
        }

        public async Task<bool> ExistsAsync(
            Expression<Func<T, bool>> predicate,
            CancellationToken ct = default)
        {
            return await _dbSet.AnyAsync(predicate, ct);
        }

        public async Task<int> CountAsync(
            Expression<Func<T, bool>>? predicate = null,
            CancellationToken ct = default)
        {
            if (predicate is null)
            {
                return await _dbSet.CountAsync(ct);
            }
            return await _dbSet.CountAsync(predicate, ct);
        }

        public void Add(T entity)
        {
            _dbSet.Add(entity);
        }

        public void AddRange(IEnumerable<T> entities)
        {
            _dbSet.AddRange(entities);
        }

        public void Update(T entity)
        {
            _dbSet.Update(entity);
        }

        public void Delete(T entity)
        {
            _dbSet.Remove(entity);
        }

        public void DeleteRange(IEnumerable<T> entities)
        {
            _dbSet.RemoveRange(entities);
        }
    }
}
