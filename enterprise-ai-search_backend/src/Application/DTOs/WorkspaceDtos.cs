namespace Application.DTOs;

public record CreateWorkspaceDto(string Name, string Description);

public record WorkspaceResponseDto(Guid Id, string Name, string Description, DateTime CreatedAt);