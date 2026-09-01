namespace Application.DTOs;

public record UserSummaryDto(
    Guid Id,
    string Name,
    string Email,
    string Role,
    DateTime CreatedAt
);

public record UpdateRoleDto(string Role);

public record DashboardStatsDto(
    int TotalUsers,
    int TotalWorkspaces,
    int TotalDocuments,
    int TotalChatMessages,
    long TotalStorageUsedBytes,
    List<UserSummaryDto> RecentUsers
);