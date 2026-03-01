namespace BarberShopBookingSystem.Models
{
    public class Appointment
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid BarberId { get; set; }
        public Guid HaircutId { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string TimeSlot { get; set; } = string.Empty;
        public string Status { get; set; } = "pending";

        // New Payment Fields
        public string PaymentStatus { get; set; } = "unpaid";
        public string? YocoPaymentId { get; set; }
        public decimal? AmountPaid { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}