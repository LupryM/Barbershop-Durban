using BarberShopBookingSystem.Data;
using BarberShopBookingSystem.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BarberShopBookingSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Require login for all appointment actions
    public class AppointmentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public AppointmentsController(ApplicationDbContext context) => _context = context;

        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetAllAppointments() =>
            Ok(await _context.Appointments.ToListAsync());

        [HttpGet("my-appointments")]
        public async Task<IActionResult> GetMyAppointments()
        {
            // Securely get the User ID from the Supabase JWT
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized();

            var userId = Guid.Parse(userIdClaim);
            var appointments = await _context.Appointments
                .Where(a => a.UserId == userId)
                .OrderByDescending(a => a.AppointmentDate)
                .ToListAsync();
            return Ok(appointments);
        }

        [HttpPost]
        public async Task<IActionResult> CreateAppointment([FromBody] AppointmentCreateDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized();
            var userId = Guid.Parse(userIdClaim);

            // Ensure we only store the Date part in UTC to avoid timezone shifts
            var appointmentDateUtc = dto.AppointmentDate.Date;

            // Validation logic
            var barber = await _context.Barbers.FindAsync(dto.BarberId);
            if (barber == null) return NotFound("Barber not found");

            var haircut = await _context.Haircuts.FindAsync(dto.HaircutId);
            if (haircut == null) return NotFound("Haircut not found");

            var conflict = await _context.Appointments.AnyAsync(a =>
                a.BarberId == dto.BarberId &&
                a.AppointmentDate == appointmentDateUtc &&
                a.TimeSlot == dto.TimeSlot &&
                a.Status != "cancelled");

            if (conflict) return BadRequest("Barber already booked at this time.");

            var appointment = new Appointment
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                BarberId = dto.BarberId,
                HaircutId = dto.HaircutId,
                AppointmentDate = appointmentDateUtc,
                TimeSlot = dto.TimeSlot,
                Status = "pending",
                PaymentStatus = "unpaid" // Initial state before Yoco
            };

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMyAppointments), new { }, appointment);
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] string newStatus)
        {
            var existing = await _context.Appointments.FindAsync(id);
            if (existing == null) return NotFound();

            existing.Status = newStatus;
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}