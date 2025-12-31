using Microsoft.AspNetCore.Mvc;

namespace ZvitPlus.API.Controllers
{
    [ApiController]
    [Route("api/test")]
    public class TestDataController(IHttpClientFactory factory, IWebHostEnvironment env) : ControllerBase
    {
        private readonly IWebHostEnvironment _env = env;
        private readonly IHttpClientFactory _factory = factory;

        [HttpPost("seed")]
        public async Task<ActionResult> SeedAsync()
        {
            if (!_env.IsDevelopment())
            {
                return Forbid();
            }

            var client = _factory.CreateClient();
            client.BaseAddress = new Uri("https://localhost:7014");

            return Ok();
        }
    }
}
