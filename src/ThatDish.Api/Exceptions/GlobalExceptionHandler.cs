using System.Net;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ThatDish.Api.Logging;

namespace ThatDish.Api.Exceptions;

/// <summary>
/// Handles all unhandled exceptions: logs with a consistent event id and returns RFC 7807 ProblemDetails.
/// </summary>
public sealed class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;
    private readonly IHostEnvironment _env;

    public GlobalExceptionHandler(
        ILogger<GlobalExceptionHandler> logger,
        IHostEnvironment env)
    {
        _logger = logger;
        _env = env;
    }

    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        var eventId = ResolveEventId(exception);
        var traceId = httpContext.TraceIdentifier;

        _logger.LogError(
            eventId,
            exception,
            "Unhandled exception. TraceId: {TraceId}, Path: {Path}, Method: {Method}",
            traceId,
            httpContext.Request.Path,
            httpContext.Request.Method);

        var problemDetails = new ProblemDetails
        {
            Type = "https://tools.ietf.org/html/rfc7231#section-6.6.1",
            Title = _env.IsDevelopment() ? exception.Message : "An error occurred processing your request.",
            Status = (int)HttpStatusCode.InternalServerError,
            Instance = httpContext.Request.Path,
            Extensions =
            {
                ["traceId"] = traceId,
                ["logEventId"] = eventId.Id,
                ["logEventName"] = eventId.Name!,
            }
        };

        if (_env.IsDevelopment())
        {
            problemDetails.Detail = exception.StackTrace;
            problemDetails.Extensions["exceptionType"] = exception.GetType().FullName;
        }

        httpContext.Response.StatusCode = problemDetails.Status ?? 500;
        httpContext.Response.ContentType = "application/problem+json";

        var problemDetailsService = httpContext.RequestServices.GetService<IProblemDetailsService>();
        var written = problemDetailsService != null &&
            await problemDetailsService.TryWriteAsync(new ProblemDetailsContext
            {
                HttpContext = httpContext,
                ProblemDetails = problemDetails
            });

        if (!written)
            await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);

        return true;
    }

    private static EventId ResolveEventId(Exception exception)
    {
        return exception switch
        {
            InvalidOperationException => LogEvents.ConfigurationError,
            KeyNotFoundException => LogEvents.NotFound,
            ArgumentException => LogEvents.ValidationError,
            _ => LogEvents.UnhandledException
        };
    }
}
