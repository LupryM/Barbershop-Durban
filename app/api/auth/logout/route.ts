import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/db';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session')?.value;

    if (sessionId) {
      // Delete session from database
      db.prepare('DELETE FROM sessions WHERE id = ?').run(sessionId);
    }

    // Clear cookie
    const response = NextResponse.json({ success: true });
    response.cookies.delete('session');

    return response;
  } catch (error) {
    console.error('[v0] Logout error:', error);
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 });
  }
}
