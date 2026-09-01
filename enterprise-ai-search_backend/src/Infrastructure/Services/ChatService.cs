using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services;

public class ChatService : IChatService
{
    private readonly AppDbContext _context;

    public ChatService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<QueryResponseDto> AskQuestionAsync(QueryRequestDto dto, Guid userId)
    {
        // 1. Save User Question to Chat History
        var userMsg = new ChatMessage
        {
            WorkspaceId = dto.WorkspaceId,
            UserId = userId,
            Role = "user",
            Content = dto.Question
        };
        _context.ChatMessages.Add(userMsg);

        // 2. Simple Keyword-based Chunk Retrieval (Context building)
        var keywords = dto.Question.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        
        var matchingChunks = await _context.DocumentChunks
            .Include(c => c.Document)
            .Where(c => c.Document.WorkspaceId == dto.WorkspaceId)
            .Take(3)
            .ToListAsync();

        var contextText = string.Join("\n---\n", matchingChunks.Select(c => c.Content));
        var sources = matchingChunks.Select(c => c.Document.Name).Distinct().ToList();

        // 3. AI Response Generation (Prompt + Context Mock)
        string aiAnswer;
        if (matchingChunks.Any())
        {
            aiAnswer = $"Based on your documents ({string.Join(", ", sources)}), here is the context found:\n\n{matchingChunks.First().Content.Trim()}...";
        }
        else
        {
            aiAnswer = "I couldn't find any relevant information in the uploaded workspace documents.";
        }

        // 4. Save Assistant Response
        var assistantMsg = new ChatMessage
        {
            WorkspaceId = dto.WorkspaceId,
            UserId = userId,
            Role = "assistant",
            Content = aiAnswer
        };
        _context.ChatMessages.Add(assistantMsg);
        await _context.SaveChangesAsync();

        return new QueryResponseDto(aiAnswer, sources);
    }

    public async Task<IEnumerable<ChatHistoryDto>> GetHistoryAsync(Guid workspaceId, Guid userId)
    {
        return await _context.ChatMessages
            .Where(m => m.WorkspaceId == workspaceId && m.UserId == userId)
            .OrderBy(m => m.CreatedAt)
            .Select(m => new ChatHistoryDto(m.Id, m.Role, m.Content, m.CreatedAt))
            .ToListAsync();
    }
}