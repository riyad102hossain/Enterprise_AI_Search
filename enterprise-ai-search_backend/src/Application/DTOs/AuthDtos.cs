namespace Application.DTOs;

public record RegisterDto(string Name, string Email, string Password, string Role = "User");

public record LoginDto(string Email, string Password);

public record AuthResponseDto(string Token, string Name, string Email, string Role);