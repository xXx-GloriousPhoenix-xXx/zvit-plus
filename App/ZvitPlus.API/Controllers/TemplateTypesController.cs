using Microsoft.AspNetCore.Mvc;
using ZvitPlus.BLL.DTOs.TemplateTypeDTO;
using ZvitPlus.BLL.Services.Interfaces;

namespace ZvitPlus.API.Controllers
{
    [ApiController]
    [Route("api/template-types")]
    public class TemplateTypesController(ITemplateTypeService service) : ControllerBase
    {
        private readonly ITemplateTypeService _service = service;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<GetTemplateTypeDTO>>> GetAllAsync(CancellationToken ct = default)
        {
            var result = await _service.GetAllAsync(ct);
            return Ok(result);
        }
    }
}
