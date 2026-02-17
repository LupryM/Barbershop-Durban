import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';

// GET - Get appointments (filtered by user role)
export async function GET(request: NextRequest) {
  try {
    const { user } = await getSession();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const date = searchParams.get('date');

    let query = `
      SELECT 
        a.*,
        cu.name as customer_name,
        cu.phone as customer_phone,
        bu.name as barber_name
      FROM appointments a
      JOIN users cu ON a.customer_id = cu.id
      JOIN users bu ON a.barber_id = bu.id
    `;

    const conditions: string[] = [];
    const params: any[] = [];

    // Filter based on user role
    if (user.role === 'customer') {
      conditions.push('a.customer_id = ?');
      params.push(user.id);
    } else if (user.role === 'barber') {
      conditions.push('a.barber_id = ?');
      params.push(user.id);
    }
    // Admin sees all appointments

    if (status) {
      conditions.push('a.status = ?');
      params.push(status);
    }

    if (date) {
      conditions.push('a.appointment_date = ?');
      params.push(date);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY a.appointment_date DESC, a.appointment_time DESC';

    const appointments = db.prepare(query).all(...params);

    return NextResponse.json({ appointments });
  } catch (error) {
    console.error('[v0] Get appointments error:', error);
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

// POST - Create appointment
export async function POST(request: NextRequest) {
  try {
    const { user } = await getSession();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { barber_id, service_name, service_price, service_duration, appointment_date, appointment_time } = data;

    // Validate required fields
    if (!barber_id || !service_name || !appointment_date || !appointment_time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check for conflicts
    const existing = db.prepare(`
      SELECT * FROM appointments 
      WHERE barber_id = ? AND appointment_date = ? AND appointment_time = ?
      AND status NOT IN ('cancelled')
    `).get(barber_id, appointment_date, appointment_time);

    if (existing) {
      return NextResponse.json({ error: 'Time slot not available' }, { status: 409 });
    }

    // Create appointment
    const stmt = db.prepare(`
      INSERT INTO appointments 
      (customer_id, barber_id, service_name, service_price, service_duration, appointment_date, appointment_time, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
    `);

    const result = stmt.run(
      user.id,
      barber_id,
      service_name,
      service_price,
      service_duration,
      appointment_date,
      appointment_time
    );

    const appointment = db.prepare('SELECT * FROM appointments WHERE id = ?').get(result.lastInsertRowid);

    return NextResponse.json({ success: true, appointment });
  } catch (error) {
    console.error('[v0] Create appointment error:', error);
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
}
