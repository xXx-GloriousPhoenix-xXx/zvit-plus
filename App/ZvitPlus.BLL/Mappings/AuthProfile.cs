using AutoMapper;
using ZvitPlus.BLL.DTOs.AuthDTOs;
using ZvitPlus.DAL.Models.Entities;
using ZvitPlus.DAL.Models.Enums;

namespace ZvitPlus.BLL.Mappings
{
    public class AuthProfile : Profile
    {
        public AuthProfile()
        {
            CreateMap<RegisterDTO, User>()
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.Role, opt => opt.MapFrom(src => UserRole.User))
                .ForMember(dest => dest.IsBanned, opt => opt.MapFrom(src => false));
        }
    }
}
