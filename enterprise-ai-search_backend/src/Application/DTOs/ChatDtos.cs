namespace Application.DTOs;

public record QueryRequestDto(Guid WorkspaceId, string Question);

public record QueryResponseDto(string Answer, List<string> Sources);

public record ChatHistoryDto(Guid Id, string Role, string Content, DateTime CreatedAt);