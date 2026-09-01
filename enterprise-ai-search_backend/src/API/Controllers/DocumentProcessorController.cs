using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class DocumentProcessorController : ControllerBase
{
    private readonly IDocumentProcessorService _processorService;

    public DocumentProcessorController(IDocumentProcessorService processorService)
    {
        _processorService = processorService;
    }

    [HttpPost("process/{documentId:guid}")]
    public async Task<IActionResult> Process(Guid documentId)
    {
        try
        {
            await _processorService.ProcessDocumentAsync(documentId);
            return Ok(new { message = "Document processed and indexed successfully." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}