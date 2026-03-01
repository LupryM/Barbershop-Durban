namespace BarberShopBookingSystem.Models
{
    public class AppointmentCreateDto
    {
        // Removed UserId from DTO for security (will pull from JWT)
        public Guid BarberId { get; set; }
        public Guid HaircutId { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string TimeSlot { get; set; } = string.Empty;
    }
}