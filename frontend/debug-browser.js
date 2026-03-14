/**
 * Browser console debug script
 * Paste this into your browser's developer console while on the booking page
 */

console.log('%c🔍 Email Debug Tool', 'font-size: 16px; font-weight: bold;');

// Test 1: Check if email API is accessible
const testEmailAPI = async () => {
  console.log('%c\n1️⃣ Testing /api/emails/send endpoint...', 'color: blue; font-weight: bold;');

  try {
    const response = await fetch('/api/emails/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // This will fail if INTERNAL_EMAIL_SECRET is not set, but that's expected
        'Authorization': 'Bearer test-secret',
      },
      body: JSON.stringify({
        type: 'CANCELLATION',
        to: 'test@example.com',
        subject: 'Test',
        payload: { date: '2024-03-15', time: '10:00' },
      }),
    });

    console.log(`Status: ${response.status}`);
    const data = await response.json();
    console.log('Response:', data);

    if (response.status === 401) {
      console.log('✅ Endpoint exists but auth failed (expected with wrong secret)');
    } else if (response.ok) {
      console.log('✅ Email sent!');
    } else {
      console.log('❌ Error:', data);
    }
  } catch (error) {
    console.error('❌ Could not reach endpoint:', error);
  }
};

// Test 2: Intercept the actual booking request
const interceptBooking = () => {
  console.log('%c\n2️⃣ Setting up booking interceptor...', 'color: blue; font-weight: bold;');

  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    const [url, options] = args;

    if (url && url.includes('/api/appointments')) {
      console.log('📤 Booking request detected:');
      console.log('URL:', url);
      console.log('Method:', options?.method);
      console.log('Body:', options?.body ? JSON.parse(options.body) : 'none');
    }

    return originalFetch.apply(this, args).then(response => {
      if (url && url.includes('/api/appointments') && options?.method === 'POST') {
        console.log('📥 Booking response:');
        console.log('Status:', response.status);
        return response.clone().text().then(text => {
          console.log('Body:', text);
          return new Response(text, response);
        });
      }
      return response;
    });
  };

  console.log('✅ Interceptor ready. Now try booking an appointment...');
};

// Test 3: Check backend connectivity
const testBackendEmail = async () => {
  console.log('%c\n3️⃣ Testing backend → frontend email flow...', 'color: blue; font-weight: bold;');

  // This tests if the .NET backend can even reach your Next.js API
  // The backend would call this after you create an appointment
  const backendSimulation = async () => {
    try {
      const response = await fetch('/api/emails/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // In production, this would be set by .NET
          'Authorization': `Bearer ${process.env.INTERNAL_EMAIL_SECRET || 'NOT-SET'}`,
        },
        body: JSON.stringify({
          type: 'BOOKING_CONFIRMATION',
          to: 'lupry@xclusivebarber.co.za',
          subject: 'Test Booking',
          payload: {
            date: '2024-03-15',
            time: '10:00 AM',
            services: 'Haircut, Beard Trim',
            barberName: 'John',
            totalPrice: 'R150',
          },
        }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  await backendSimulation();
};

// Run the tests
console.log('%c\nRunning tests...', 'color: green; font-weight: bold;');
testEmailAPI();
interceptBooking();
testBackendEmail();

console.log('%c\n✅ Debug tools loaded! Now try booking an appointment.', 'color: green; font-weight: bold;');
