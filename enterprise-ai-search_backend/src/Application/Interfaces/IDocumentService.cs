using Application.DTOs;

namespace Application.Interfaces;

public interface IDocumentService
{
    Task<DocumentResponseDto> UploadAsync(UploadDocumentDto dto, Guid userId);
    Task<IEnumerable<DocumentResponseDto>> GetByWorkspaceAsync(Guid workspaceId, Guid userId);
    Task<bool> DeleteAsync(Guid documentId, Guid userId);
}