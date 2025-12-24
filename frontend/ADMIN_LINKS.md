Public Site: https://jcf-english-web.vercel.app
Admin Login (share privately): https://jcf-english-web.vercel.app/admin-login
Admin Dashboard (after login): https://jcf-english-web.vercel.app/admin

Notes & Recommendations:
- Share only the **Admin Login** URL with trusted client contacts — do not publish it on public pages.
- The site's navigation hides admin links by default; admin pages require admin authentication.
- For extra security consider:
  - Enabling 2FA for admin accounts (if available).
  - Using a non-guessable admin path (e.g., `/admin-<secret>`) if you want obscurity in addition to auth.
  - Adding HTTP basic auth or IP allowlist at the hosting layer.
- If you want, I can: (A) add HTTP Basic Auth at Vercel (via Vercel dashboard), (B) move admin-login to a secret path, or (C) remove the `public/admin.html` file entirely.

How to use:
- Give the client the two links above.
- Ask them to use `/admin-login` to sign in; after successful login they can visit `/admin` for management tasks.

If you want, I can also commit and push these files to the repository and trigger a redeploy.