namespace ThatDish.Api.Logging;

/// <summary>
/// Central log event IDs for error handling and diagnostics.
/// Use these when logging so support and monitoring can correlate by event id.
/// </summary>
public static class LogEvents
{
    /// <summary>Unhandled exception in a request (500).</summary>
    public static readonly EventId UnhandledException = new(5000, nameof(UnhandledException));

    /// <summary>Invalid or missing configuration (e.g. connection string).</summary>
    public static readonly EventId ConfigurationError = new(5001, nameof(ConfigurationError));

    /// <summary>Requested resource not found (404).</summary>
    public static readonly EventId NotFound = new(5002, nameof(NotFound));

    /// <summary>Validation failure (400).</summary>
    public static readonly EventId ValidationError = new(5003, nameof(ValidationError));

    /// <summary>Database or persistence failure.</summary>
    public static readonly EventId PersistenceError = new(5004, nameof(PersistenceError));
}
