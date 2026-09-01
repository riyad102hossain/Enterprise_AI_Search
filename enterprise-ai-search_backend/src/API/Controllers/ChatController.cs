using System.Security.Claims;
using Application.DTOs;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly IChatService _chatService;

    public ChatController(IChatService chatService)
    {
        _chatService = chatService;
    }

    private Guid GetUserId() =>
        Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost("query")]
    public async Task<IActionResult> Query([FromBody] QueryRequestDto dto)
    {
        var response = await _chatService.AskQuestionAsync(dto, GetUserId());
        return Ok(response);
    }

    [HttpGet("history/{workspaceId:guid}")]
    public async Task<IActionResult> GetHistory(Guid workspaceId)
    {
        var history = await _chatService.GetHistoryAsync(workspaceId, GetUserId());
        return Ok(history);
    }
}