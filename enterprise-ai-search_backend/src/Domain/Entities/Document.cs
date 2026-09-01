namespace Domain.Entities;

public class Document
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public string ContentType { get; set; } = string.Empty;
    public string Status { get; set; } = "Pending"; // Pending, Processing, Indexed, Failed
    
    public Guid WorkspaceId { get; set; }
    public Workspace Workspace { get; set; } = null!;
    
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<DocumentChunk> Chunks { get; set; } = new List<DocumentChunk>();
}