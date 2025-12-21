/**
 * Demo test script
 * Usage: node scripts/demo_test.js
 * It will: register a test user, login, create a demo order, verify demo payment, call enroll, list transactions
 */
const fetch = require('node-fetch');
const API = process.env.API_BASE || 'http://localhost:4000/api';

async function run() {
  try {
    console.log('Demo test start...');
    const testUser = { name: 'Demo User', email: `demo+${Date.now()}@example.com`, password: 'password123' };

    // Register
    let r = await fetch(`${API}/auth/register`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(testUser)
    });
    let data = await r.json();
    if (!r.ok) throw new Error('Register failed: ' + (data.message || JSON.stringify(data)));
    console.log('Registered user:', data.user.email);

    // Login
    r = await fetch(`${API}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: testUser.email, password: testUser.password }) });
    data = await r.json();
    if (!r.ok) throw new Error('Login failed: ' + (data.message || JSON.stringify(data)));
    const token = data.token;
    console.log('Logged in, token length:', token.length);

    // Create demo order
    r = await fetch(`${API}/payments/create-order`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: 2999 }) });
    data = await r.json();
    console.log('Order created:', data.order.id, 'demo?', data.demo === true);

    // Verify demo payment (create transaction)
    r = await fetch(`${API}/payments/verify`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ demo: true, order_id: data.order.id, userId: data.user ? data.user.id : undefined, email: testUser.email, courseName: 'Spoken English', amount: 2999 })
    });
    const verify = await r.json();
    console.log('Verify response:', verify);

    // Enroll the user (auth)
    r = await fetch(`${API}/courses/enroll`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ courseName: 'Spoken English', payment: { provider: 'demo', amount: 2999, orderId: data.order.id } }) });
    const enroll = await r.json();
    console.log('Enroll response:', enroll);

    // Get transactions (requires admin) - we'll just fetch list publically isn't allowed, so show how to fetch as admin if you have one
    console.log('\nDemo script complete. To view transactions, login as admin and visit /admin/payments or call /api/transactions with admin token.');
  } catch (err) {
    console.error('Demo test error:', err.message);
  }
}

run();
