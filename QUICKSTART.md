# SmartFetch - Quick Start Guide

Get SmartFetch running in 5 minutes.

## Prerequisites

- Node.js 18+
- Gmail account with 2FA
- Supabase account

## 1. Get Credentials (5 minutes)

### Gmail App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Windows Computer"
3. Copy the 16-character password

### Supabase
1. Create project at https://supabase.com
2. Copy Project URL and Service Role Key
3. Run SQL files in Supabase SQL Editor:
   - `supabase-tables.sql`
   - `supabase-rls-policies.sql`

## 2. Configure Backend (2 minutes)

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_16_char_app_password
JWT_SECRET=any_random_string_here
```

## 3. Start Backend (1 minute)

```bash
cd backend
npm install
npm run dev
```

Wait for: `Server running on http://localhost:5000`

## 4. Start Frontend (1 minute)

In a new terminal:
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

## 5. Test Login

1. Click "Login"
2. Enter email: `test@example.com`
3. Click "Send OTP"
4. Check email for OTP
5. Enter OTP and click "Verify"
6. Done! You're logged in

## Switching to Phone Login

1. Click "Phone" tab
2. Enter 10-digit Indian number: `9876543210`
3. Click "Send OTP"
4. Check email for OTP (backend sends via email for now)
5. Enter OTP and verify

## Troubleshooting

### Backend won't start
```bash
# Check Node version
node --version  # Should be 18+

# Clear node_modules and reinstall
rm -rf backend/node_modules
cd backend && npm install
npm run dev
```

### Email not sending
- Verify Gmail app password (16 chars)
- Check 2FA is enabled
- Look in spam folder
- Check backend logs for errors

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check NEXT_PUBLIC_API_URL in frontend/.env
- Check browser console for CORS errors

### OTP verification fails
- Ensure OTP is exactly 6 digits
- Check OTP hasn't expired (10 minutes)
- Verify email/phone matches what OTP was sent to

## Next Steps

- Read `BACKEND_SETUP.md` for detailed backend configuration
- Read `FRONTEND_SETUP.md` for detailed frontend configuration
- Check `PROJECT_STRUCTURE.md` for project organization
- Deploy to production when ready

## File Structure

```
smartfetch/
├── backend/              # Express.js backend
│   ├── src/
│   │   ├── server.ts
│   │   ├── config/
│   │   ├── services/
│   │   ├── routes/
│   │   └── middleware/
│   ├── .env
│   └── package.json
├── frontend/             # Next.js frontend
│   ├── src/
│   │   ├── config/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── pages/
│   ├── .env
│   └── package.json
├── components/           # Shared components
├── lib/                  # Shared utilities
└── supabase-*.sql        # Database schemas
```

## API Endpoints

```
POST /api/auth/send-otp       - Send OTP
POST /api/auth/verify-otp     - Verify OTP & login
POST /api/auth/resend-otp     - Resend OTP
POST /api/auth/logout        - Logout
GET  /api/users/profile/:id  - Get user profile
```

## Environment Variables

### Backend (.env)
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- EMAIL_USER
- EMAIL_PASSWORD
- JWT_SECRET
- PORT (default: 5000)

### Frontend (.env)
- NEXT_PUBLIC_API_URL (default: http://localhost:5000)

## Support

For detailed setup, see:
- `BACKEND_SETUP.md` - Backend configuration
- `FRONTEND_SETUP.md` - Frontend configuration
- `backend/README.md` - Backend documentation
- `frontend/README.md` - Frontend documentation

Happy coding! 🚀
