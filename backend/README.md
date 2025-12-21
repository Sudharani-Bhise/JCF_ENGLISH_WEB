# Backend for JCF English

Quick start:

1. Copy `.env.example` to `.env` and set `MONGO_URI`, `JWT_SECRET`, and any optional service keys (Razorpay/Twilio/SMTP) as needed.

2. Optional: Useful environment variables

- `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` — for real payments (not required for demo mode)
- `VITE_RAZORPAY_KEY_ID` — frontend key for Vite build (not required for demo mode)
- `DEMO_PAYMENTS=true` — **set to true to force demo-only payments** (recommended until you want to enable a real gateway)
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM` — for SMS
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` — for emails
- `DEBUG_OTP=true` — in development returns OTP in API response to make testing easier

3. Install dependencies:

```bash
cd backend
npm install
```

3. Seed data (optional):

```bash
npm run seed
```

4. Run server:

```bash
npm run dev
```

API base: `http://localhost:4000/api`

---

## Demo test (quick)
If you want to run a quick automated demo that registers a user, creates a demo order, verifies it and enrolls the user (no real payment required):

1. Start backend:

```bash
cd backend
npm run dev
```

2. In a separate terminal run the demo test:

```bash
cd backend
npm run demo-test
```

Expected output (summary):
- "Registered user: demo+<timestamp>@example.com"
- "Logged in, token length: <n>"
- "Order created: order_demo_<timestamp> demo? true"
- "Verify response: { ok: true, demo: true }"
- "Enroll response: { message: 'Enrolled', courses: [...] }"

Notes:
- This uses demo mode only (controlled by `DEMO_PAYMENTS=true` in `.env`). No Razorpay keys or real payments are required.
- To view created transactions use the Admin Payments page at `/admin/payments` or call `GET /api/transactions` with an **admin** token.
