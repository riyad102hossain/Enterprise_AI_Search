using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using UglyToad.PdfPig;

namespace Infrastructure.Services;

public class DocumentProcessorService : IDocumentProcessorService
{
    private readonly AppDbContext _context;

    public DocumentProcessorService(AppDbContext context)
    {
        _context = context;
    }

    public async Task ProcessDocumentAsync(Guid documentId)
    {
        var document = await _context.Documents.FindAsync(documentId);
        if (document == null) return;

        document.Status = "Processing";
        await _context.SaveChangesAsync();

        try
        {
            string extractedText = string.Empty;

            // Extract text based on file type
            if (document.Name.EndsWith(".pdf", StringComparison.OrdinalIgnoreCase))
            {
                using var pdf = PdfDocument.Open(document.FilePath);
                foreach (var page in pdf.GetPages())
                {
                    extractedText += page.Text + "\n";
                }
            }
            else
            {
                extractedText = await File.ReadAllTextAsync(document.FilePath);
            }

            // Simple Chunking logic (500 characters per chunk)
            var chunks = ChunkText(extractedText, 500);

            foreach (var chunkText in chunks)
            {
                _context.DocumentChunks.Add(new DocumentChunk
                {
                    DocumentId = document.Id,
                    Content = chunkText
                });
            }

            document.Status = "Indexed";
            await _context.SaveChangesAsync();
        }
        catch (Exception)
        {
            document.Status = "Failed";
            await _context.SaveChangesAsync();
            throw;
        }
    }

    private List<string> ChunkText(string text, int chunkSize)
    {
        var chunks = new List<string>();
        if (string.IsNullOrWhiteSpace(text)) return chunks;

        for (int i = 0; i < text.Length; i += chunkSize)
        {
            chunks.Add(text.Substring(i, Math.Min(chunkSize, text.Length - i)));
        }
        return chunks;
    }
}