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
                .ForCtorParam("Id", opt => opt.MapFrom(src => src.Id))
                .ForCtorParam("Name", opt => opt.MapFrom(src => src.Login))
                .ForCtorParam("Role", opt => opt.MapFrom(src => src.Role))
                .ForCtorParam("IsBanned", opt => opt.MapFrom(src => src.IsBanned));
                
        }
    }
}
