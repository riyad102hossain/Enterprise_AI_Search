using Application.DTOs;

namespace Application.Interfaces;

public interface IChatService
{
    Task<QueryResponseDto> AskQuestionAsync(QueryRequestDto dto, Guid userId);
    Task<IEnumerable<ChatHistoryDto>> GetHistoryAsync(Guid workspaceId, Guid userId);
}