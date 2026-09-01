using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services;

public class WorkspaceService : IWorkspaceService
{
    private readonly AppDbContext _context;

    public WorkspaceService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<WorkspaceResponseDto> CreateAsync(CreateWorkspaceDto dto, Guid userId)
    {
        var workspace = new Workspace
        {
            Name = dto.Name,
            Description = dto.Description,
            UserId = userId
        };

        _context.Workspaces.Add(workspace);
        await _context.SaveChangesAsync();

        return new WorkspaceResponseDto(workspace.Id, workspace.Name, workspace.Description, workspace.CreatedAt);
    }

    public async Task<IEnumerable<WorkspaceResponseDto>> GetUserWorkspacesAsync(Guid userId)
    {
        return await _context.Workspaces
            .Where(w => w.UserId == userId)
            .Select(w => new WorkspaceResponseDto(w.Id, w.Name, w.Description, w.CreatedAt))
            .ToListAsync();
    }

    public async Task<WorkspaceResponseDto?> GetByIdAsync(Guid id, Guid userId)
    {
        var workspace = await _context.Workspaces
            .FirstOrDefaultAsync(w => w.Id == id && w.UserId == userId);

        if (workspace == null) return null;

        return new WorkspaceResponseDto(workspace.Id, workspace.Name, workspace.Description, workspace.CreatedAt);
    }

    public async Task<bool> DeleteAsync(Guid id, Guid userId)
    {
        var workspace = await _context.Workspaces
            .FirstOrDefaultAsync(w => w.Id == id && w.UserId == userId);

        if (workspace == null) return false;

        _context.Workspaces.Remove(workspace);
        await _context.SaveChangesAsync();
        return true;
    }
}