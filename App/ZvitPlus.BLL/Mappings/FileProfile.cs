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
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
                .ForMember(dest => dest.Author, opt => opt.MapFrom(src => src.Author!.Login))
                .ForMember(dest => dest.TemplateType, opt => opt.MapFrom(src =>
                    src.Template!.TemplateType!.Name
                    ?? src.Report!.Template!.TemplateType!.Name
                ))
                .ForMember(dest => dest.IsPrivate, opt => opt.MapFrom(src => src.IsPrivate))
                .ForMember(dest => dest.FileId, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.FileSize, opt => opt.MapFrom(src => src.FileSize))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt))
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => src.UpdatedAt));

            CreateMap<FileEntity, GetFileEntityDTO>()
                .ForCtorParam("Id", opt => opt.MapFrom(src =>
                    src.Template != null
                        ? src.Template.Id
                        : src.Report!.Id))
                .ForCtorParam("Name", opt => opt.MapFrom(src => src.Name))
                .ForCtorParam("Author", opt => opt.MapFrom(src => src.Author!.Login))
                .ForCtorParam("TemplateType", opt => opt.MapFrom(src =>
                    src.Template != null
                        ? src.Template.TemplateType!.Name
                        : src.Report!.Template!.TemplateType!.Name))
                .ForCtorParam("IsPrivate", opt => opt.MapFrom(src => src.IsPrivate))
                .ForCtorParam("FileId", opt => opt.MapFrom(src => src.Id))
                .ForCtorParam("FileSize", opt => opt.MapFrom(src => src.FileSize))
                .ForCtorParam("CreatedAt", opt => opt.MapFrom(src => src.CreatedAt))
                .ForCtorParam("UpdatedAt", opt => opt.MapFrom(src => src.UpdatedAt));

            CreateMap<UpdateReportDTO, UpdateFileDTO>();
            CreateMap<UpdateTemplateDTO, UpdateFileDTO>();
        }
    }
}
