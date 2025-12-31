namespace ZvitPlus.DAL.Context.DataFactory
{
    public interface IDataFactory
    {
        Task InitializeAsync(CancellationToken ct = default);
    }
}
