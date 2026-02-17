import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    if (!db) {
      return NextResponse.json({ error: 'Database not configured. Please set up a production database.' }, { status: 503 });
    }

    const barbers = db.prepare(`
      SELECT 
        u.id,
        u.name,
        u.phone,
        b.specialty,
        b.experience,
        b.image_url,
        b.is_active
      FROM users u
      JOIN barbers b ON u.id = b.user_id
      WHERE u.role = 'barber' AND b.is_active = 1
      ORDER BY u.name
    `).all();

    return NextResponse.json({ barbers });
  } catch (error) {
    console.error('[v0] Get barbers error:', error);
    return NextResponse.json({ error: 'Failed to fetch barbers' }, { status: 500 });
  }
}
