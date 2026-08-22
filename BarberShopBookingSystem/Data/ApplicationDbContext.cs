using BarberShopBookingSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace BarberShopBookingSystem.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
        public DbSet<AppointmentService> AppointmentServices { get; set; }
        public DbSet<Barber> Barbers { get; set; }
        public DbSet<Haircut> Haircuts { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<Profile> Profiles { get; set; } // Added for user roles and Auth link
        public DbSet<ClosedDate> ClosedDates { get; set; } // Added for closing dates

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // ADD THIS BLOCK:
            modelBuilder.Entity<AppointmentService>()
                .HasKey(aps => new { aps.AppointmentId, aps.HaircutId });
            // Mapping to lowercase Supabase table names
            modelBuilder.Entity<Barber>().ToTable("barbers");
            modelBuilder.Entity<Haircut>().ToTable("haircuts");
            modelBuilder.Entity<Appointment>().ToTable("appointments");
            modelBuilder.Entity<Profile>().ToTable("profiles");
            modelBuilder.Entity<ClosedDate>().ToTable("closed_dates");

            // Optional: Ensure Price in Haircuts handles decimal correctly for ZAR
            modelBuilder.Entity<Haircut>()
                .Property(h => h.Price)
                .HasPrecision(18, 2);


 
        }
    }
}