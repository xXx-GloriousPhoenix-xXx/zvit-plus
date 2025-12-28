using AutoMapper;
using ZvitPlus.BLL.DTOs.UserDTOs;
using ZvitPlus.DAL.Models.Entities;

namespace ZvitPlus.BLL.Mappings
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            CreateMap<User, GetUserDTO>()
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Login));
        }
    }
}
