import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// GET - Get single customer with full appointment history
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(['admin', 'barber']);

    const params = await context.params;
    
    // Get customer details
    const customer = db.prepare(`
      SELECT 
        u.id,
        u.name,
        u.phone,
        u.email,
        u.created_at,
        c.preferences,
        c.notes
      FROM users u
      JOIN customers c ON u.id = c.user_id
      WHERE u.id = ? AND u.role = 'customer'
    `).get(params.id) as any;

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Get appointment history
    const appointments = db.prepare(`
      SELECT 
        a.*,
        bu.name as barber_name
      FROM appointments a
      JOIN users bu ON a.barber_id = bu.id
      WHERE a.customer_id = ?
      ORDER BY a.appointment_date DESC, a.appointment_time DESC
    `).all(params.id);

    return NextResponse.json({ 
      customer: {
        ...customer,
        appointments
      }
    });
  } catch (error: any) {
    console.error('[v0] Get customer detail error:', error);
    
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    
    return NextResponse.json({ error: 'Failed to fetch customer details' }, { status: 500 });
  }
}
