namespace Domain.Entities;

public class ChatMessage
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid WorkspaceId { get; set; }
    public Workspace Workspace { get; set; } = null!;
    
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    
    public string Content { get; set; } = string.Empty;
    public string Role { get; set; } = "user"; // "user" or "assistant"
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}