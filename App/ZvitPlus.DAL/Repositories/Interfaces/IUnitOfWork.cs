using ZvitPlus.DAL.Models.Entities;

namespace ZvitPlus.DAL.Repositories.Interfaces
{
    public interface IUnitOfWork : IDisposable, IAsyncDisposable
    {
        IBaseRepository<User> Users { get; }
        IBaseRepository<FileEntity> Files { get; }
        IBaseRepository<TemplateType> TemplateTypes { get; }
        IBaseRepository<Template> Templates { get; }
        IBaseRepository<Report> Reports { get; }

        Task<int> CompleteAsync(CancellationToken ct = default);
        Task BeginTransactionAsync(CancellationToken ct = default);
        Task CommitTransactionAsync(CancellationToken ct = default);
        Task RollbackTransactionAsync(CancellationToken ct = default);
    }
}
