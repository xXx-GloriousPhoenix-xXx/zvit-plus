using ZvitPlus.BLL.DTOs.FileDTOs;

namespace ZvitPlus.BLL.DTOs.FileEntityDTOs
{
    public sealed record GetFullFileEntityDTO(
        GetFileEntityDTO Meta,
        Stream File
    );
}
