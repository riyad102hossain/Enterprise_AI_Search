namespace Application.Interfaces;

public interface IDocumentProcessorService
{
    Task ProcessDocumentAsync(Guid documentId);
}