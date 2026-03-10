import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * GET /api/appointments/all
 *
 * Returns all appointments with flattened shape for admin and barber dashboards.
 * Requires RLS policy allowing staff/admin to read all appointments, or service role key.
 *
 * Optional query params:
 *   ?date=yyyy-MM-dd  — filter to a single date
 *   ?barber_id=uuid   — filter by barber
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateFilter = searchParams.get('date');
    const barberFilter = searchParams.get('barber_id');

    let query = supabase
      .from('appointments')
      .select(`
        id,
        appointment_date,
        time_slot,
        status,
        total_price,
        barber_id,
        haircuts ( name, price ),
        profiles:profiles!user_id ( full_name, email ),
        barbers ( id, full_name )
      `)
      .order('appointment_date', { ascending: false })
      .order('time_slot', { ascending: true });

    if (dateFilter) {
      query = query.eq('appointment_date', dateFilter);
    }
    if (barberFilter) {
      query = query.eq('barber_id', barberFilter);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[appointments/all] Supabase error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const appointments = (data ?? []).map((a: any) => {
      const servicePrice = a.total_price != null
        ? `R${a.total_price}`
        : a.haircuts?.price != null
          ? `R${a.haircuts.price}`
          : '—';

      return {
        id: a.id,
        appointment_date: a.appointment_date,
        appointment_time: a.time_slot,
        status: a.status,
        service_name: a.haircuts?.name ?? '—',
        service_price: servicePrice,
        customer_name: a.profiles?.full_name ?? 'Guest',
        customer_email: a.profiles?.email ?? null,
        barber_name: a.barbers?.full_name ?? '—',
        barber_id: a.barber_id,
        customer_phone: '',
      };
    });

    return NextResponse.json({ appointments });
  } catch (err) {
    console.error('[appointments/all] Unexpected error:', err);
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}
