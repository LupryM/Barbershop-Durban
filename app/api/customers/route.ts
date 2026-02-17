import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// GET - Get all customers with their appointment history
export async function GET(request: NextRequest) {
  try {
    await requireAuth(['admin', 'barber']);

    const customers = db.prepare(`
      SELECT 
        u.id,
        u.name,
        u.phone,
        u.email,
        u.created_at,
        c.preferences,
        c.notes,
        COUNT(a.id) as total_appointments,
        MAX(a.appointment_date) as last_visit
      FROM users u
      JOIN customers c ON u.id = c.user_id
      LEFT JOIN appointments a ON u.id = a.customer_id AND a.status = 'completed'
      WHERE u.role = 'customer'
      GROUP BY u.id, u.name, u.phone, u.email, u.created_at, c.preferences, c.notes
      ORDER BY u.name
    `).all();

    return NextResponse.json({ customers });
  } catch (error: any) {
    console.error('[v0] Get customers error:', error);
    
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}

// PATCH - Update customer notes/preferences
export async function PATCH(request: NextRequest) {
  try {
    await requireAuth(['admin', 'barber']);

    const data = await request.json();
    const { user_id, preferences, notes } = data;

    if (!user_id) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (preferences !== undefined) {
      updates.push('preferences = ?');
      values.push(preferences);
    }

    if (notes !== undefined) {
      updates.push('notes = ?');
      values.push(notes);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No updates provided' }, { status: 400 });
    }

    values.push(user_id);

    const updateQuery = `UPDATE customers SET ${updates.join(', ')} WHERE user_id = ?`;
    db.prepare(updateQuery).run(...values);

    const customer = db.prepare(`
      SELECT u.*, c.preferences, c.notes 
      FROM users u 
      JOIN customers c ON u.id = c.user_id 
      WHERE u.id = ?
    `).get(user_id);

    return NextResponse.json({ success: true, customer });
  } catch (error: any) {
    console.error('[v0] Update customer error:', error);
    
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    
    return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 });
  }
}
