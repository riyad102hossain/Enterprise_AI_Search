using Application.DTOs;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize(Policy = "RequireAdminRole")]
[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;

    public AdminController(IAdminService adminService)
    {
        _adminService = adminService;
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard()
    {
        var stats = await _adminService.GetDashboardStatsAsync();
        return Ok(stats);
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _adminService.GetAllUsersAsync();
        return Ok(users);
    }

    [HttpPut("users/{id:guid}/role")]
    public async Task<IActionResult> UpdateRole(Guid id, [FromBody] UpdateRoleDto dto)
    {
        if (dto.Role != "Admin" && dto.Role != "User")
            return BadRequest(new { message = "Role must be either 'Admin' or 'User'." });

        var success = await _adminService.UpdateUserRoleAsync(id, dto.Role);
        if (!success) return NotFound(new { message = "User not found." });

        return Ok(new { message = $"User role updated to '{dto.Role}' successfully." });
    }

    [HttpDelete("users/{id:guid}")]
    public async Task<IActionResult> DeleteUser(Guid id)
    {
        var success = await _adminService.DeleteUserAsync(id);
        if (!success) return NotFound(new { message = "User not found." });

        return Ok(new { message = "User deleted successfully." });
    }
}