using AutoMapper;
using ZvitPlus.BLL.DTOs.FileDTOs;
using ZvitPlus.BLL.DTOs.FileEntityDTOs;
using ZvitPlus.BLL.DTOs.ReportDTOs;
using ZvitPlus.BLL.DTOs.TemplateDTOs;
using ZvitPlus.BLL.Services.Enums;
using ZvitPlus.DAL.Models.Entities;

namespace ZvitPlus.BLL.Mappings
{
    public class FileProfile : Profile
    {
        public FileProfile()
        {
            CreateMap<CreateTemplateDTO, CreateFileDTO>()
                .ForMember(dest => dest.Type, opt => opt.MapFrom(src => FileType.Template));
            
            CreateMap<CreateReportDTO, CreateFileDTO>()
                .ForMember(dest => dest.Type, opt => opt.MapFrom(src => FileType.Report));

            CreateMap<FileEntity, GetFileEntityDTO>()
                .ForMember(dest => dest.Author, opt => opt.MapFrom(src => src.Author!.Login))
                .ForMember(dest => dest.TemplateType, opt => opt.MapFrom(src =>
                    src.Template!.TemplateType!.Name
                    ?? src.Report!.Template!.TemplateType!.Name
                ))
                .ForMember(dest => dest.FileId, opt => opt.MapFrom(src => src.Id));
        }
    }
}
