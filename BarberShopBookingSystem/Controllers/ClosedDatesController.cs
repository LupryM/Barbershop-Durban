using BarberShopBookingSystem.Data;
using BarberShopBookingSystem.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text.Json.Serialization;

namespace BarberShopBookingSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClosedDatesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ClosedDatesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/closeddates
        [HttpGet]
        public async Task<IActionResult> GetClosedDates()
        {
            var dates = await _context.ClosedDates
                .OrderBy(d => d.Date)
                .ToListAsync();
            return Ok(dates);
        }

        // POST: api/closeddates
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateClosedDate([FromBody] CreateClosedDateDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized();
            var userId = Guid.Parse(userIdClaim);

            var userProfile = await _context.Profiles.FindAsync(userId);
            if (userProfile == null || userProfile.Role != "admin")
                return Forbid();

            var existing = await _context.ClosedDates.FindAsync(dto.Date);
            if (existing != null)
                return BadRequest(new { error = "This date is already closed." });

            var closedDate = new ClosedDate
            {
                Date = dto.Date,
                Reason = dto.Reason,
                CreatedAt = DateTime.UtcNow
            };

            _context.ClosedDates.Add(closedDate);
            await _context.SaveChangesAsync();

            return Ok(closedDate);
        }

        // DELETE: api/closeddates/2026-08-25
        [HttpDelete("{date}")]
        [Authorize]
        public async Task<IActionResult> DeleteClosedDate(DateOnly date)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized();
            var userId = Guid.Parse(userIdClaim);

            var userProfile = await _context.Profiles.FindAsync(userId);
            if (userProfile == null || userProfile.Role != "admin")
                return Forbid();

            var closedDate = await _context.ClosedDates.FindAsync(date);
            if (closedDate == null)
                return NotFound();

            _context.ClosedDates.Remove(closedDate);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Date reopened successfully." });
        }
    }

    public class CreateClosedDateDto
    {
        [JsonPropertyName("date")]
        public DateOnly Date { get; set; }

        [JsonPropertyName("reason")]
        public string? Reason { get; set; }
    }
}
