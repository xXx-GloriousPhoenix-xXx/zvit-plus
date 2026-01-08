using AutoMapper;
using System;
using System.Collections.Generic;
using System.Text;
using ZvitPlus.BLL.DTOs.TemplateTypeDTO;
using ZvitPlus.DAL.Models.Entities;

namespace ZvitPlus.BLL.Mappings
{
    public class TemplateTypeProfile : Profile
    {
        public TemplateTypeProfile()
        {
            CreateMap<TemplateType, GetTemplateTypeDTO>();
        }
    }
}
