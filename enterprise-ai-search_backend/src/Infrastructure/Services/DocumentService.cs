using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services;

public class DocumentService : IDocumentService
{
    private readonly AppDbContext _context;
    private readonly string _uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "Storage", "Uploads");

    public DocumentService(AppDbContext context)
    {
        _context = context;
        if (!Directory.Exists(_uploadPath))
        {
            Directory.CreateDirectory(_uploadPath);
        }
    }

    public async Task<DocumentResponseDto> UploadAsync(UploadDocumentDto dto, Guid userId)
    {
        var workspaceExists = await _context.Workspaces.AnyAsync(w => w.Id == dto.WorkspaceId && w.UserId == userId);
        if (!workspaceExists)
            throw new Exception("Workspace not found or unauthorized.");

        if (dto.File == null || dto.File.Length == 0)
            throw new Exception("File is empty.");

        var fileName = $"{Guid.NewGuid()}_{dto.File.FileName}";
        var filePath = Path.Combine(_uploadPath, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await dto.File.CopyToAsync(stream);
        }

        var document = new Document
        {
            Name = dto.File.FileName,
            FilePath = filePath,
            FileSize = dto.File.Length,
            ContentType = dto.File.ContentType,
            Status = "Pending",
            WorkspaceId = dto.WorkspaceId,
            UserId = userId
        };

        _context.Documents.Add(document);
        await _context.SaveChangesAsync();

        return new DocumentResponseDto(
            document.Id, document.Name, document.FileSize, document.ContentType, document.Status, document.WorkspaceId, document.CreatedAt
        );
    }

    public async Task<IEnumerable<DocumentResponseDto>> GetByWorkspaceAsync(Guid workspaceId, Guid userId)
    {
        return await _context.Documents
            .Where(d => d.WorkspaceId == workspaceId && d.UserId == userId)
            .Select(d => new DocumentResponseDto(
                d.Id, d.Name, d.FileSize, d.ContentType, d.Status, d.WorkspaceId, d.CreatedAt))
            .ToListAsync();
    }

    public async Task<bool> DeleteAsync(Guid documentId, Guid userId)
    {
        var document = await _context.Documents
            .FirstOrDefaultAsync(d => d.Id == documentId && d.UserId == userId);

        if (document == null) return false;

        if (File.Exists(document.FilePath))
        {
            File.Delete(document.FilePath);
        }

        _context.Documents.Remove(document);
        await _context.SaveChangesAsync();
        return true;
    }
}