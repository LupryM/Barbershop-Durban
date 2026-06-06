using BarberShopBookingSystem.Data;
using Microsoft.EntityFrameworkCore;
using System.Net.Http.Headers;
using System.Text.Json;

namespace BarberShopBookingSystem.Services
{
    /// <summary>
    /// Background service that cleans up abandoned bookings.
    /// 
    /// TWO categories:
    ///   1. No Yoco checkout created (user never clicked pay) → cancel after 10 min
    ///   2. Yoco checkout exists (user went to payment page) → CHECK Yoco first!
    ///      - If Yoco says paid → confirm the booking + send email (recovers "lost" payments)
    ///      - If Yoco says not paid and older than 15 min → cancel (truly abandoned)
    /// 
    /// Runs every 2 minutes.
    /// </summary>
    public class AbandonedBookingCleanupService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<AbandonedBookingCleanupService> _logger;
        private readonly IConfiguration _config;

        private static readonly TimeSpan Interval = TimeSpan.FromMinutes(2);
        private static readonly TimeSpan NoCheckoutExpiry = TimeSpan.FromMinutes(10);
        private static readonly TimeSpan WithCheckoutExpiry = TimeSpan.FromMinutes(15);

        public AbandonedBookingCleanupService(
            IServiceScopeFactory scopeFactory,
            ILogger<AbandonedBookingCleanupService> logger,
            IConfiguration config)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
            _config = config;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await CleanupAsync(stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error during abandoned booking cleanup");
                }

                await Task.Delay(Interval, stoppingToken);
            }
        }

        private async Task CleanupAsync(CancellationToken stoppingToken)
        {
            using var scope = _scopeFactory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            var localTimeNow = DateTime.UtcNow.AddHours(2);

            // ───────────────────────────────────────────────────────────────────
            // CATEGORY 1: No Yoco checkout — user started booking but never paid
            // Safe to cancel after 10 minutes (same as before)
            // ───────────────────────────────────────────────────────────────────
            var noCheckoutExpiry = localTimeNow - NoCheckoutExpiry;
            var cancelledCount = await context.Appointments
                .Where(a => a.Status == "pending"
                    && a.PaymentStatus == "unpaid"
                    && (a.YocoPaymentId == null || a.YocoPaymentId == "")
                    && a.CreatedAt < noCheckoutExpiry)
                .ExecuteUpdateAsync(s => s.SetProperty(a => a.Status, "cancelled"), stoppingToken);

            if (cancelledCount > 0)
            {
                _logger.LogInformation("Cancelled {Count} abandoned bookings (no checkout created)", cancelledCount);
            }

            // ───────────────────────────────────────────────────────────────────
            // CATEGORY 2: Yoco checkout exists — user went to the payment page
            // MUST check with Yoco before cancelling! The customer may have paid.
            // ───────────────────────────────────────────────────────────────────
            var checkoutExpiry = localTimeNow - WithCheckoutExpiry;
            var pendingWithCheckout = await context.Appointments
                .Where(a => a.Status == "pending"
                    && a.PaymentStatus == "unpaid"
                    && a.YocoPaymentId != null && a.YocoPaymentId != ""
                    && a.CreatedAt < checkoutExpiry)
                .ToListAsync(stoppingToken);

            if (pendingWithCheckout.Count == 0) return;

            var secretKey = _config["Yoco:SecretKey"];
            if (string.IsNullOrEmpty(secretKey))
            {
                _logger.LogWarning("Yoco:SecretKey not configured — cannot verify checkout statuses, skipping");
                return;
            }

            // Resolve email service for sending confirmations on recovered payments
            var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();

            using var httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", secretKey);

            int recovered = 0;
            int cancelledCheckout = 0;

            foreach (var appointment in pendingWithCheckout)
            {
                if (stoppingToken.IsCancellationRequested) break;

                try
                {
                    var response = await httpClient.GetAsync(
                        $"https://payments.yoco.com/api/checkouts/{appointment.YocoPaymentId}",
                        stoppingToken);

                    if (!response.IsSuccessStatusCode)
                    {
                        _logger.LogWarning(
                            "Yoco API returned {Status} for checkout {CheckoutId} (appointment {ApptId}) — skipping for now",
                            response.StatusCode, appointment.YocoPaymentId, appointment.Id);
                        continue; // Don't cancel — Yoco might be temporarily down, try again next cycle
                    }

                    var json = await response.Content.ReadAsStringAsync(stoppingToken);
                    var yocoData = JsonSerializer.Deserialize<JsonElement>(json);
                    var yocoStatus = yocoData.GetProperty("status").GetString()?.ToLower();

                    if (yocoStatus == "paid" || yocoStatus == "succeeded" || yocoStatus == "successful" || yocoStatus == "completed")
                    {
                        // 🎉 PAYMENT WAS SUCCESSFUL — recover this booking!
                        appointment.PaymentStatus = "paid";
                        appointment.Status = "confirmed";
                        await context.SaveChangesAsync(stoppingToken);
                        recovered++;

                        _logger.LogWarning(
                            "🎉 RECOVERED payment for appointment {ApptId}! Yoco checkout {CheckoutId} was paid but our system missed it.",
                            appointment.Id, appointment.YocoPaymentId);

                        // Send the confirmation email the customer never got
                        try
                        {
                            var profile = await context.Profiles.FindAsync(new object[] { appointment.UserId }, stoppingToken);
                            var customerEmail = profile?.Email;

                            if (!string.IsNullOrEmpty(customerEmail))
                            {
                                var barber = appointment.BarberId.HasValue
                                    ? await context.Barbers.FindAsync(new object[] { appointment.BarberId.Value }, stoppingToken)
                                    : null;
                                var barberName = barber?.FullName ?? "Your Barber";

                                var apptServices = await context.AppointmentServices
                                    .Where(aps => aps.AppointmentId == appointment.Id)
                                    .ToListAsync(stoppingToken);

                                var haircutIds = apptServices.Select(aps => aps.HaircutId).ToList();
                                var haircuts = await context.Haircuts
                                    .Where(h => haircutIds.Contains(h.Id))
                                    .ToListAsync(stoppingToken);
                                var serviceNames = haircuts.Any()
                                    ? string.Join(", ", haircuts.Select(h => h.Name))
                                    : "Haircut Service";

                                await emailService.SendBookingConfirmationEmail(
                                    customerEmail,
                                    appointment.AppointmentDate.ToString("yyyy-MM-dd"),
                                    appointment.TimeSlot,
                                    serviceNames,
                                    barberName,
                                    $"R{appointment.TotalPrice:F0}"
                                );

                                _logger.LogInformation(
                                    "Sent recovery confirmation email to {Email} for appointment {ApptId}",
                                    customerEmail, appointment.Id);
                            }
                        }
                        catch (Exception ex)
                        {
                            _logger.LogError(ex, "Failed to send recovery email for appointment {ApptId}", appointment.Id);
                        }
                    }
                    else
                    {
                        // Yoco says not paid — truly abandoned, safe to cancel
                        appointment.Status = "cancelled";
                        await context.SaveChangesAsync(stoppingToken);
                        cancelledCheckout++;

                        _logger.LogInformation(
                            "Cancelled abandoned checkout appointment {ApptId} (Yoco status: {YocoStatus})",
                            appointment.Id, yocoStatus);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex,
                        "Error checking Yoco status for appointment {ApptId} — will retry next cycle",
                        appointment.Id);
                    // Don't cancel on error — try again next cycle
                }
            }

            if (recovered > 0)
                _logger.LogWarning("🎉 Recovered {Count} paid bookings that the frontend missed!", recovered);
            if (cancelledCheckout > 0)
                _logger.LogInformation("Cancelled {Count} abandoned checkout bookings (Yoco confirmed unpaid)", cancelledCheckout);
        }
    }
}
