using Application.DTOs;
using Application.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services;

public class AdminService : IAdminService
{
    private readonly AppDbContext _context;

    public AdminService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<UserSummaryDto>> GetAllUsersAsync()
    {
        return await _context.Users
            .OrderByDescending(u => u.CreatedAt)
            .Select(u => new UserSummaryDto(u.Id, u.Name, u.Email, u.Role, u.CreatedAt))
            .ToListAsync();
    }

    public async Task<bool> UpdateUserRoleAsync(Guid userId, string newRole)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return false;

        user.Role = newRole;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteUserAsync(Guid userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return false;

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<DashboardStatsDto> GetDashboardStatsAsync()
    {
        var totalUsers = await _context.Users.CountAsync();
        var totalWorkspaces = await _context.Workspaces.CountAsync();
        var totalDocuments = await _context.Documents.CountAsync();
        var totalChats = await _context.ChatMessages.CountAsync();
        
        var totalStorage = await _context.Documents.SumAsync(d => (long?)d.FileSize) ?? 0;

        var recentUsers = await _context.Users
            .OrderByDescending(u => u.CreatedAt)
            .Take(5)
            .Select(u => new UserSummaryDto(u.Id, u.Name, u.Email, u.Role, u.CreatedAt))
            .ToListAsync();

        return new DashboardStatsDto(
            totalUsers,
            totalWorkspaces,
            totalDocuments,
            totalChats,
            totalStorage,
            recentUsers
        );
    }
}