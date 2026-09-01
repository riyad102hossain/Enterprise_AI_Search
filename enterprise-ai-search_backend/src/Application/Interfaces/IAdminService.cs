using Application.DTOs;

namespace Application.Interfaces;

public interface IAdminService
{
    Task<IEnumerable<UserSummaryDto>> GetAllUsersAsync();
    Task<bool> UpdateUserRoleAsync(Guid userId, string newRole);
    Task<bool> DeleteUserAsync(Guid userId);
    Task<DashboardStatsDto> GetDashboardStatsAsync();
}