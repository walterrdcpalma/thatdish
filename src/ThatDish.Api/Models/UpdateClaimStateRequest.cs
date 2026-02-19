namespace ThatDish.Api.Models;

/// <summary>
/// Request body for PATCH /api/restaurants/{id}/claim-state (temporary endpoint until admin module).
/// </summary>
public record UpdateClaimStateRequest(string State);
