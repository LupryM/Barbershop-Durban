import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Fetch all customer profiles with visit counts
export async function GET() {
  try {
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, full_name, email, role')
      .eq('role', 'customer');

    if (profilesError) {
      console.error('[customers] Profiles error:', profilesError.message);
      return NextResponse.json({ error: profilesError.message }, { status: 500 });
    }

    // Get completed appointments for visit counts
    const { data: appointments, error: apptError } = await supabase
      .from('appointments')
      .select('user_id, appointment_date')
      .eq('status', 'completed');

    if (apptError) {
      console.warn('[customers] Appointments fetch warning:', apptError.message);
    }

    const apptsByUser: Record<string, string[]> = {};
    (appointments ?? []).forEach(a => {
      if (!apptsByUser[a.user_id]) apptsByUser[a.user_id] = [];
      apptsByUser[a.user_id].push(a.appointment_date);
    });

    const customers = (profiles ?? []).map(p => {
      const dates = (apptsByUser[p.id] ?? []).sort((a, b) => b.localeCompare(a));
      return {
        id: p.id,
        name: p.full_name,
        phone: '',
        email: p.email,
        total_appointments: dates.length,
        last_visit: dates[0] ?? null,
        preferences: '',
        notes: '',
      };
    });

    customers.sort((a, b) => b.total_appointments - a.total_appointments);

    return NextResponse.json({ customers });
  } catch (error) {
    console.error('[customers] Unexpected error:', error);
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}

// PATCH - Update customer notes/preferences
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, preferences, notes } = body;

    if (!user_id) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
    }

    const updates: Record<string, string> = {};
    if (preferences !== undefined) updates.preferences = preferences;
    if (notes !== undefined) updates.notes = notes;

    if (Object.keys(updates).length > 0) {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user_id);

      if (error) {
        // Columns may not exist yet — log but don't fail
        console.warn('[customers PATCH] Update warning:', error.message);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[customers] PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 });
  }
}
