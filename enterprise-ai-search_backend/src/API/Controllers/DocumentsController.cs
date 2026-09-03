using System.Security.Claims;
using Application.DTOs;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class DocumentsController : ControllerBase
{
    private readonly IDocumentService _documentService;

    public DocumentsController(IDocumentService documentService)
    {
        _documentService = documentService;
    }

    private Guid GetUserId() =>
        Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

   [HttpPost("upload")]
[Consumes("multipart/form-data")]
public async Task<IActionResult> Upload([FromForm] UploadDocumentDto dto)
{
    var result = await _documentService.UploadAsync(dto, GetUserId());
    return Ok(result);
}

    [HttpGet("workspace/{workspaceId:guid}")]
    public async Task<IActionResult> GetByWorkspace(Guid workspaceId)
    {
        var result = await _documentService.GetByWorkspaceAsync(workspaceId, GetUserId());
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var success = await _documentService.DeleteAsync(id, GetUserId());
        if (!success) return NotFound();
        return NoContent();
    }
}