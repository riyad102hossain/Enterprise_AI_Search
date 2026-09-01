using Application.DTOs;

namespace Application.Interfaces;

public interface IWorkspaceService
{
    Task<WorkspaceResponseDto> CreateAsync(CreateWorkspaceDto dto, Guid userId);
    Task<IEnumerable<WorkspaceResponseDto>> GetUserWorkspacesAsync(Guid userId);
    Task<WorkspaceResponseDto?> GetByIdAsync(Guid id, Guid userId);
    Task<bool> DeleteAsync(Guid id, Guid userId);
}