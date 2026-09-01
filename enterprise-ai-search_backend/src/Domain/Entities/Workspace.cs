namespace Domain.Entities;

public class Workspace
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Document> Documents { get; set; } = new List<Document>();
    public ICollection<ChatMessage> ChatMessages { get; set; } = new List<ChatMessage>();
}