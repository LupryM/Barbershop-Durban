/**
 * Debug script to test the email sending flow
 * Run with: npx ts-node debug-emails.ts
 */

const debugEmail = async () => {
  console.log('🔍 Email Debug Script\n');

  // Check environment variables
  console.log('1️⃣ Checking environment variables...');
  const resendKey = process.env.RESEND_API_KEY;
  const internalSecret = process.env.INTERNAL_EMAIL_SECRET;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL;

  console.log(`   RESEND_API_KEY: ${resendKey ? '✅ Set' : '❌ NOT SET'}`);
  console.log(`   INTERNAL_EMAIL_SECRET: ${internalSecret ? '✅ Set' : '❌ NOT SET'}`);
  console.log(`   API URL: ${apiUrl ? `✅ ${apiUrl}` : '❌ NOT SET'}\n`);

  if (!resendKey || !internalSecret) {
    console.error('❌ Missing required environment variables!');
    process.exit(1);
  }

  // Test email API endpoint
  console.log('2️⃣ Testing email API endpoint...');
  const testPayload = {
    type: 'CANCELLATION',
    to: 'test@example.com',
    subject: 'Test Email',
    payload: {
      date: '2024-03-15',
      time: '10:00 AM',
    },
  };

  try {
    const response = await fetch('http://localhost:3000/api/emails/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${internalSecret}`,
      },
      body: JSON.stringify(testPayload),
    });

    console.log(`   Status: ${response.status}`);
    const data = await response.json();
    console.log(`   Response:`, JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('\n✅ Email API is working!');
    } else {
      console.log('\n❌ Email API returned an error');
    }
  } catch (error) {
    console.error('\n❌ Failed to call email API:', error);
    console.log('   Make sure your Next.js dev server is running on http://localhost:3000');
  }

  // Check Resend key validity
  console.log('\n3️⃣ Checking Resend API key...');
  try {
    const resendCheck = await fetch('https://api.resend.com/emails', {
      headers: { Authorization: `Bearer ${resendKey}` },
    });
    if (resendCheck.ok) {
      console.log('   ✅ Resend API key is valid');
    } else {
      console.log(`   ⚠️ Resend returned status ${resendCheck.status}`);
    }
  } catch (error) {
    console.error('   ❌ Could not verify Resend key:', error);
  }
};

debugEmail().catch(console.error);
