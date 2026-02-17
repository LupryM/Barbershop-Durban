import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// In production, you would integrate with a real SMS service like Twilio, Africa's Talking, or Clickatell
// For development, we'll just log the OTP
function sendSMS(phone: string, code: string) {
  console.log(`[v0] SMS to ${phone}: Your Xclusive Barber verification code is: ${code}`);
  // TODO: Integrate with SMS provider for production
  // Example: await twilioClient.messages.create({ to: phone, from: TWILIO_NUMBER, body: `Your code is: ${code}` });
}

export async function POST(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({ error: 'Database not configured. Please set up a production database.' }, { status: 503 });
    }

    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in database
    const stmt = db.prepare(
      'INSERT INTO otp_codes (phone, code, expires_at) VALUES (?, ?, ?)'
    );
    stmt.run(phone, code, expiresAt.toISOString());

    // Send SMS
    sendSMS(phone, code);

    return NextResponse.json({ 
      success: true,
      message: 'OTP sent successfully',
      // Always include code for testing (no real SMS integration yet)
      code
    });
  } catch (error) {
    console.error('[v0] Send OTP error:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}
