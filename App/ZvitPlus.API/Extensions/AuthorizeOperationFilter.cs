using Microsoft.AspNetCore.Authorization;
using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace ZvitPlus.API.Extensions
{
    public sealed class AuthorizeOperationFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            var hasAuthorize =
                context.MethodInfo.DeclaringType?
                    .GetCustomAttributes(true)
                    .OfType<AuthorizeAttribute>()
                    .Any() == true
                || context.MethodInfo
                    .GetCustomAttributes(true)
                    .OfType<AuthorizeAttribute>()
                    .Any();

            if (!hasAuthorize)
                return;

            operation.Security ??= [];

            operation.Security.Add(
                new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecuritySchemeReference(
                            "Bearer",          // referenceId
                            context.Document,  // OpenApiDocument
                            null               // description
                        ),
                        new List<string>()
                    }
                }
            );
        }
    }
}