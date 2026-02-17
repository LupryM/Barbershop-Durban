import { cookies } from 'next/headers';
import db from './db';

export interface User {
  id: number;
  phone: string;
  name: string | null;
  email: string | null;
  role: 'customer' | 'barber' | 'admin';
  created_at: string;
  last_login: string | null;
}

export async function getSession(): Promise<{ user: User | null }> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session')?.value;

  if (!sessionId) {
    return { user: null };
  }

  try {
    // Get session
    const session = db.prepare(`
      SELECT s.*, u.* FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.id = ? AND s.expires_at > datetime('now')
    `).get(sessionId) as any;

    if (!session) {
      return { user: null };
    }

    return {
      user: {
        id: session.user_id,
        phone: session.phone,
        name: session.name,
        email: session.email,
        role: session.role,
        created_at: session.created_at,
        last_login: session.last_login
      }
    };
  } catch (error) {
    console.error('[v0] Session error:', error);
    return { user: null };
  }
}

export async function requireAuth(allowedRoles?: string[]) {
  const { user } = await getSession();

  if (!user) {
    throw new Error('Unauthorized');
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    throw new Error('Forbidden');
  }

  return user;
}
