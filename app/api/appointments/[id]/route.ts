import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';

// GET - Get single appointment
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await getSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await context.params;
    const appointment = db.prepare(`
      SELECT 
        a.*,
        cu.name as customer_name,
        cu.phone as customer_phone,
        bu.name as barber_name
      FROM appointments a
      JOIN users cu ON a.customer_id = cu.id
      JOIN users bu ON a.barber_id = bu.id
      WHERE a.id = ?
    `).get(params.id) as any;

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    // Check permissions
    if (
      user.role === 'customer' && appointment.customer_id !== user.id ||
      user.role === 'barber' && appointment.barber_id !== user.id
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ appointment });
  } catch (error) {
    console.error('[v0] Get appointment error:', error);
    return NextResponse.json({ error: 'Failed to fetch appointment' }, { status: 500 });
  }
}

// PATCH - Update appointment (reschedule or change status)
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await getSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await context.params;
    const data = await request.json();
    const { appointment_date, appointment_time, status } = data;

    // Get existing appointment
    const appointment = db.prepare('SELECT * FROM appointments WHERE id = ?').get(params.id) as any;
    
    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    // Check permissions
    if (user.role === 'customer' && appointment.customer_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Build update query
    const updates: string[] = [];
    const values: any[] = [];

    if (appointment_date && appointment_time) {
      // Check for conflicts when rescheduling
      const conflict = db.prepare(`
        SELECT * FROM appointments 
        WHERE barber_id = ? AND appointment_date = ? AND appointment_time = ?
        AND id != ? AND status NOT IN ('cancelled')
      `).get(appointment.barber_id, appointment_date, appointment_time, params.id);

      if (conflict) {
        return NextResponse.json({ error: 'Time slot not available' }, { status: 409 });
      }

      updates.push('appointment_date = ?', 'appointment_time = ?');
      values.push(appointment_date, appointment_time);
    }

    if (status) {
      // Validate status transitions
      const validTransitions: Record<string, string[]> = {
        pending: ['confirmed', 'cancelled'],
        confirmed: ['completed', 'cancelled'],
        completed: [],
        cancelled: []
      };

      if (!validTransitions[appointment.status]?.includes(status)) {
        return NextResponse.json({ error: 'Invalid status transition' }, { status: 400 });
      }

      updates.push('status = ?');
      values.push(status);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No updates provided' }, { status: 400 });
    }

    updates.push('updated_at = datetime("now")');
    values.push(params.id);

    const updateQuery = `UPDATE appointments SET ${updates.join(', ')} WHERE id = ?`;
    db.prepare(updateQuery).run(...values);

    const updated = db.prepare('SELECT * FROM appointments WHERE id = ?').get(params.id);

    return NextResponse.json({ success: true, appointment: updated });
  } catch (error) {
    console.error('[v0] Update appointment error:', error);
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
  }
}

// DELETE - Cancel appointment
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await getSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await context.params;
    const appointment = db.prepare('SELECT * FROM appointments WHERE id = ?').get(params.id) as any;
    
    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    // Check permissions
    if (user.role === 'customer' && appointment.customer_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update status to cancelled instead of deleting
    db.prepare('UPDATE appointments SET status = ?, updated_at = datetime("now") WHERE id = ?')
      .run('cancelled', params.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[v0] Cancel appointment error:', error);
    return NextResponse.json({ error: 'Failed to cancel appointment' }, { status: 500 });
  }
}
