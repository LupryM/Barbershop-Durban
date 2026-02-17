import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';

// GET - Get barber availability
export async function GET(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({ error: 'Database not configured. Please set up a production database.' }, { status: 503 });
    }

    const { searchParams } = new URL(request.url);
    const barberId = searchParams.get('barberId');
    const date = searchParams.get('date');

    let query = 'SELECT * FROM barber_availability WHERE 1=1';
    const params: any[] = [];

    if (barberId) {
      query += ' AND barber_id = ?';
      params.push(barberId);
    }

    if (date) {
      query += ' AND date = ?';
      params.push(date);
    }

    query += ' ORDER BY date DESC, start_time';

    const availability = db.prepare(query).all(...params);

    return NextResponse.json({ availability });
  } catch (error) {
    console.error('[v0] Get availability error:', error);
    return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 });
  }
}

// POST - Add barber unavailability (time off, lunch, etc.)
export async function POST(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({ error: 'Database not configured. Please set up a production database.' }, { status: 503 });
    }

    const { user } = await getSession();
    
    if (!user || (user.role !== 'barber' && user.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { barber_id, date, start_time, end_time, type, reason } = data;

    // Validate required fields
    if (!barber_id || !date || !start_time || !end_time || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Barbers can only set their own availability unless admin
    if (user.role === 'barber' && barber_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Insert availability record
    const stmt = db.prepare(`
      INSERT INTO barber_availability (barber_id, date, start_time, end_time, type, reason)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(barber_id, date, start_time, end_time, type, reason || null);

    const availability = db.prepare('SELECT * FROM barber_availability WHERE id = ?').get(result.lastInsertRowid);

    return NextResponse.json({ success: true, availability });
  } catch (error) {
    console.error('[v0] Create availability error:', error);
    return NextResponse.json({ error: 'Failed to create availability record' }, { status: 500 });
  }
}

// DELETE - Remove availability record
export async function DELETE(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({ error: 'Database not configured. Please set up a production database.' }, { status: 503 });
    }

    const { user } = await getSession();
    
    if (!user || (user.role !== 'barber' && user.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Availability ID required' }, { status: 400 });
    }

    const availability = db.prepare('SELECT * FROM barber_availability WHERE id = ?').get(id) as any;
    
    if (!availability) {
      return NextResponse.json({ error: 'Availability record not found' }, { status: 404 });
    }

    // Barbers can only delete their own records unless admin
    if (user.role === 'barber' && availability.barber_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    db.prepare('DELETE FROM barber_availability WHERE id = ?').run(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[v0] Delete availability error:', error);
    return NextResponse.json({ error: 'Failed to delete availability record' }, { status: 500 });
  }
}
