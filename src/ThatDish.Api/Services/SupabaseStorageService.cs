using System.Net.Http.Headers;
using Microsoft.AspNetCore.Http;

namespace ThatDish.Api.Services;

public sealed class SupabaseStorageService : ISupabaseStorageService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _configuration;
    private readonly ILogger<SupabaseStorageService> _logger;

    public SupabaseStorageService(
        IHttpClientFactory httpClientFactory,
        IConfiguration configuration,
        ILogger<SupabaseStorageService> logger)
    {
        _httpClientFactory = httpClientFactory;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<string> UploadDishImageAsync(IFormFile image, CancellationToken cancellationToken)
    {
        if (image.Length <= 0)
            throw new InvalidOperationException("Image file is empty.");
        if (string.IsNullOrWhiteSpace(image.ContentType) || !image.ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
            throw new InvalidOperationException("Only image uploads are supported.");

        var projectUrl = ResolveProjectUrl();
        var serviceRoleKey = _configuration["Supabase:ServiceRoleKey"];
        var bucket = _configuration["Supabase:StorageBucket"] ?? "dish-images";

        if (string.IsNullOrWhiteSpace(serviceRoleKey))
            throw new InvalidOperationException("Supabase ServiceRoleKey is not configured.");

        var ext = Path.GetExtension(image.FileName);
        if (string.IsNullOrWhiteSpace(ext)) ext = ".jpg";
        var objectPath = $"dishes/{Guid.NewGuid():N}{ext.ToLowerInvariant()}";
        var uploadUrl = $"{projectUrl}/storage/v1/object/{bucket}/{objectPath}";

        using var request = new HttpRequestMessage(HttpMethod.Post, uploadUrl);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", serviceRoleKey);
        request.Headers.TryAddWithoutValidation("apikey", serviceRoleKey);
        request.Headers.TryAddWithoutValidation("x-upsert", "false");

        var content = new StreamContent(image.OpenReadStream());
        content.Headers.ContentType = new MediaTypeHeaderValue(image.ContentType);
        request.Content = content;

        var client = _httpClientFactory.CreateClient(nameof(SupabaseStorageService));
        using var response = await client.SendAsync(request, cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            var body = await response.Content.ReadAsStringAsync(cancellationToken);
            _logger.LogError("Supabase upload failed. Status: {Status}. Body: {Body}", (int)response.StatusCode, body);
            throw new InvalidOperationException($"Supabase upload failed: {(int)response.StatusCode}");
        }

        return $"{projectUrl}/storage/v1/object/public/{bucket}/{objectPath}";
    }

    private string ResolveProjectUrl()
    {
        var direct = _configuration["Supabase:ProjectUrl"];
        if (!string.IsNullOrWhiteSpace(direct))
            return direct.TrimEnd('/');

        var issuer = _configuration["Supabase:Issuer"]?.TrimEnd('/');
        if (!string.IsNullOrWhiteSpace(issuer) && issuer.EndsWith("/auth/v1", StringComparison.OrdinalIgnoreCase))
            return issuer[..^"/auth/v1".Length];

        throw new InvalidOperationException("Supabase ProjectUrl is not configured.");
    }
}

