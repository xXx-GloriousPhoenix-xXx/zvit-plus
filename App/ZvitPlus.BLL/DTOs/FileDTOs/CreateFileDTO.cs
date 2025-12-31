using System.ComponentModel.DataAnnotations;
using ZvitPlus.BLL.Services.Enums;

namespace ZvitPlus.BLL.DTOs.FileDTOs
{
    public sealed class CreateFileDTO
    {
        [Required] public required string Name { get; init; }
        [Required] public required FileType Type { get; init; }
        [Required] public required bool IsPrivate { get; init; }
        [Required] public required Stream File { get; init; }
    }
}
