using Microsoft.AspNetCore.Http;

namespace ThatDish.Api.Services;

public interface ISupabaseStorageService
{
    Task<string> UploadDishImageAsync(IFormFile image, CancellationToken cancellationToken);
}

