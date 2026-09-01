using Microsoft.AspNetCore.Http;

namespace Application.DTOs;

public record UploadDocumentDto(Guid WorkspaceId, IFormFile File);

public record DocumentResponseDto(
    Guid Id,
    string Name,
    long FileSize,
    string ContentType,
    string Status,
    Guid WorkspaceId,
    DateTime CreatedAt
);