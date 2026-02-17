import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await requireAuth(['admin']);

    if (!db) {
      return NextResponse.json({ error: 'Database not configured. Please set up a production database.' }, { status: 503 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'week'; // day, week, month, year

    // Helper function to get date range
    const getDateRange = () => {
      const now = new Date();
      let startDate: Date;

      switch (period) {
        case 'day':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      }

      return {
        start: startDate.toISOString().split('T')[0],
        end: now.toISOString().split('T')[0]
      };
    };

    const { start, end } = getDateRange();

    // Total revenue
    const revenueData = db.prepare(`
      SELECT 
        SUM(CAST(REPLACE(service_price, 'R', '') AS INTEGER)) as total_revenue,
        COUNT(*) as completed_appointments
      FROM appointments
      WHERE status = 'completed'
      AND appointment_date BETWEEN ? AND ?
    `).get(start, end) as any;

    // Revenue by service
    const revenueByService = db.prepare(`
      SELECT 
        service_name,
        COUNT(*) as count,
        SUM(CAST(REPLACE(service_price, 'R', '') AS INTEGER)) as revenue
      FROM appointments
      WHERE status = 'completed'
      AND appointment_date BETWEEN ? AND ?
      GROUP BY service_name
      ORDER BY revenue DESC
    `).all(start, end);

    // Popular services
    const popularServices = db.prepare(`
      SELECT 
        service_name,
        COUNT(*) as bookings
      FROM appointments
      WHERE appointment_date BETWEEN ? AND ?
      GROUP BY service_name
      ORDER BY bookings DESC
      LIMIT 5
    `).all(start, end);

    // Barber performance
    const barberStats = db.prepare(`
      SELECT 
        bu.name as barber_name,
        COUNT(*) as total_appointments,
        SUM(CASE WHEN a.status = 'completed' THEN CAST(REPLACE(a.service_price, 'R', '') AS INTEGER) ELSE 0 END) as revenue
      FROM appointments a
      JOIN users bu ON a.barber_id = bu.id
      WHERE a.appointment_date BETWEEN ? AND ?
      GROUP BY bu.name
      ORDER BY revenue DESC
    `).all(start, end);

    // Daily breakdown
    const dailyBreakdown = db.prepare(`
      SELECT 
        appointment_date as date,
        COUNT(*) as appointments,
        SUM(CASE WHEN status = 'completed' THEN CAST(REPLACE(service_price, 'R', '') AS INTEGER) ELSE 0 END) as revenue
      FROM appointments
      WHERE appointment_date BETWEEN ? AND ?
      GROUP BY appointment_date
      ORDER BY appointment_date
    `).all(start, end);

    // Customer metrics
    const customerMetrics = db.prepare(`
      SELECT 
        COUNT(DISTINCT customer_id) as unique_customers,
        COUNT(*) as total_bookings,
        ROUND(CAST(COUNT(*) AS FLOAT) / COUNT(DISTINCT customer_id), 2) as avg_bookings_per_customer
      FROM appointments
      WHERE appointment_date BETWEEN ? AND ?
    `).get(start, end) as any;

    // Cancellation rate
    const cancellationData = db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled
      FROM appointments
      WHERE appointment_date BETWEEN ? AND ?
    `).get(start, end) as any;

    const cancellationRate = cancellationData.total > 0 
      ? ((cancellationData.cancelled / cancellationData.total) * 100).toFixed(1)
      : '0';

    return NextResponse.json({
      period,
      dateRange: { start, end },
      revenue: {
        total: revenueData.total_revenue || 0,
        completed_appointments: revenueData.completed_appointments || 0,
        by_service: revenueByService
      },
      popular_services: popularServices,
      barber_stats: barberStats,
      daily_breakdown: dailyBreakdown,
      customer_metrics: {
        unique_customers: customerMetrics.unique_customers || 0,
        total_bookings: customerMetrics.total_bookings || 0,
        avg_bookings_per_customer: customerMetrics.avg_bookings_per_customer || 0
      },
      cancellation_rate: cancellationRate
    });
  } catch (error: any) {
    console.error('[v0] Analytics error:', error);
    
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
