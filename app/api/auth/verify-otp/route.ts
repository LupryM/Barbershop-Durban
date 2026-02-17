import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { randomBytes } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { phone, code, name } = await request.json();

    if (!phone || !code) {
      return NextResponse.json(
        { error: 'Phone and code required' },
        { status: 400 }
      );
    }

    // Verify OTP
    const otpStmt = db.prepare(`
      SELECT * FROM otp_codes 
      WHERE phone = ? AND code = ? AND used = 0 AND expires_at > datetime('now')
      ORDER BY created_at DESC LIMIT 1
    `);
    const otp = otpStmt.get(phone, code) as any;

    if (!otp) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    // Mark OTP as used
    db.prepare('UPDATE otp_codes SET used = 1 WHERE id = ?').run(otp.id);

    // Find or create user
    let user = db.prepare('SELECT * FROM users WHERE phone = ?').get(phone) as any;
    
    if (!user) {
      // Create new user
      const insertStmt = db.prepare(
        'INSERT INTO users (phone, name, role, last_login) VALUES (?, ?, ?, datetime("now"))'
      );
      const result = insertStmt.run(phone, name || null, 'customer');
      user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid) as any;

      // Create customer profile
      db.prepare('INSERT INTO customers (user_id) VALUES (?)').run(user.id);
    } else {
      // Update last login
      db.prepare('UPDATE users SET last_login = datetime("now") WHERE id = ?').run(user.id);
    }

    // Create session
    const sessionId = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    db.prepare(
      'INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)'
    ).run(sessionId, user.id, expiresAt.toISOString());

    // Set session cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        role: user.role
      }
    });

    response.cookies.set('session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt
    });

    return response;
  } catch (error) {
    console.error('[v0] Verify OTP error:', error);
    return NextResponse.json(
      { error: 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}
