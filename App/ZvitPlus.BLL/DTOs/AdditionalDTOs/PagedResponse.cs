namespace ZvitPlus.BLL.DTOs.AdditionalDTOs
{
    public sealed record PagedResponse<T>(
        IReadOnlyCollection<T> Items,
        int CurrentPage,
        int TotalCount,
        int TotalPages
    );
}
