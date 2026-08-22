using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BarberShopBookingSystem.Models
{
    [Table("closed_dates")]
    public class ClosedDate
    {
        [Key]
        [Column("date")]
        [JsonPropertyName("date")]
        public DateOnly Date { get; set; }

        [Column("reason")]
        [JsonPropertyName("reason")]
        public string? Reason { get; set; }

        [Column("created_at")]
        [JsonPropertyName("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
