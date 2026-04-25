# SmartFetch Setup Checklist

Complete checklist for setting up SmartFetch authentication system.

## Prerequisites ✓

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Gmail account with 2FA enabled
- [ ] Supabase account created
- [ ] Git installed (optional)

## Step 1: Get Credentials

### Gmail App Password
- [ ] Go to https://myaccount.google.com/apppasswords
- [ ] Select "Mail" and "Windows Computer"
- [ ] Copy 16-character password
- [ ] Save it somewhere safe

### Supabase Setup
- [ ] Create project at https://supabase.com
- [ ] Go to Project Settings → API
- [ ] Copy Project URL (SUPABASE_URL)
- [ ] Copy Service Role Key (SUPABASE_SERVICE_ROLE_KEY)
- [ ] Go to SQL Editor
- [ ] Run `supabase-tables.sql`
- [ ] Run `supabase-rls-policies.sql`
- [ ] Verify tables appear in Tables list

## Step 2: Backend Setup

### Configuration
- [ ] Navigate to `backend` folder
- [ ] Copy `.env.example` to `.env`
- [ ] Edit `.env` and fill in:
  - [ ] SUPABASE_URL
  - [ ] SUPABASE_SERVICE_ROLE_KEY
  - [ ] EMAIL_USER (your Gmail)
  - [ ] EMAIL_PASSWORD (16-char app password)
  - [ ] JWT_SECRET (any random string)
  - [ ] PORT (default: 5000)
  - [ ] FRONTEND_URL (default: http://localhost:3000)

### Installation
- [ ] Run `npm install`
- [ ] Wait for all dependencies to install
- [ ] Check for any errors

### Start Backend
- [ ] Run `npm run dev`
- [ ] Wait for server to start
- [ ] Verify: "Server running on http://localhost:5000"
- [ ] Verify: "Email service initialized"
- [ ] Verify: "Redis initialized" (or fallback message)

### Test Backend
- [ ] Open new terminal
- [ ] Run: `curl http://localhost:5000/health`
- [ ] Should return: `{"status":"ok",...}`

## Step 3: Frontend Setup

### Configuration
- [ ] Navigate to `frontend` folder
- [ ] Check `.env` file exists
- [ ] Verify `NEXT_PUBLIC_API_URL=http://localhost:5000`
- [ ] Verify `VITE_SUPABASE_URL` is set (optional)

### Installation
- [ ] Run `npm install`
- [ ] Wait for all dependencies to install
- [ ] Check for any errors

### Start Frontend
- [ ] Run `npm run dev`
- [ ] Wait for dev server to start
- [ ] Verify: "ready - started server on 0.0.0.0:3000"

## Step 4: Test Authentication

### Email OTP Login
- [ ] Open http://localhost:3000 in browser
- [ ] Click "Login" button
- [ ] Select "Email" tab
- [ ] Enter test email: `test@example.com`
- [ ] Enter name: `Test User` (optional)
- [ ] Click "Send OTP"
- [ ] Wait for success message
- [ ] Check email inbox for OTP
- [ ] Copy 6-digit OTP
- [ ] Enter OTP in verification screen
- [ ] Click "Verify OTP"
- [ ] Verify: Logged in successfully
- [ ] Check localStorage for `auth_token`

### Phone OTP Login
- [ ] Click "Logout" (if logged in)
- [ ] Click "Login" button
- [ ] Select "Phone" tab
- [ ] Enter 10-digit number: `9876543210`
- [ ] Enter name: `Test User` (optional)
- [ ] Click "Send OTP"
- [ ] Wait for success message
- [ ] Check email for OTP (backend sends via email)
- [ ] Copy 6-digit OTP
- [ ] Enter OTP in verification screen
- [ ] Click "Verify OTP"
- [ ] Verify: Logged in successfully

## Step 5: Verify Integration

### Backend Logs
- [ ] Check backend terminal for logs
- [ ] Verify no errors
- [ ] Verify OTP generation logs
- [ ] Verify email sending logs

### Frontend Console
- [ ] Open DevTools (F12)
- [ ] Go to Console tab
- [ ] Verify no errors
- [ ] Check Network tab for API calls
- [ ] Verify requests to `/api/auth/*`

### Local Storage
- [ ] Open DevTools (F12)
- [ ] Go to Application → Local Storage
- [ ] Verify `auth_token` exists
- [ ] Verify `user` data exists
- [ ] Check token format (JWT)

### Database
- [ ] Go to Supabase dashboard
- [ ] Go to SQL Editor
- [ ] Run: `SELECT * FROM users;`
- [ ] Verify test user exists
- [ ] Check user email/phone

## Step 6: Advanced Testing

### OTP Expiry
- [ ] Send OTP
- [ ] Wait 10 minutes
- [ ] Try to verify expired OTP
- [ ] Verify: "OTP has expired" error

### OTP Attempt Limit
- [ ] Send OTP
- [ ] Enter wrong OTP 5 times
- [ ] Verify: "Maximum OTP attempts exceeded" error
- [ ] Resend OTP to try again

### Rate Limiting
- [ ] Send OTP
- [ ] Immediately try to send again
- [ ] Verify: "Please wait X seconds" error
- [ ] Wait 30 seconds
- [ ] Try again
- [ ] Verify: OTP sent successfully

### Email Validation
- [ ] Try invalid email: `notanemail`
- [ ] Verify: "Please enter a valid email" error
- [ ] Try valid email: `test@example.com`
- [ ] Verify: OTP sent successfully

### Phone Validation
- [ ] Try invalid phone: `123`
- [ ] Verify: "Please enter a valid 10-digit Indian phone number" error
- [ ] Try valid phone: `9876543210`
- [ ] Verify: OTP sent successfully

## Step 7: Production Preparation

### Environment Variables
- [ ] Review all .env variables
- [ ] Change JWT_SECRET to strong random string
- [ ] Verify all credentials are correct
- [ ] Remove any test/demo values

### Security
- [ ] Enable HTTPS (in production)
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable logging
- [ ] Set up monitoring

### Database
- [ ] Verify RLS policies are enabled
- [ ] Test user isolation
- [ ] Verify indexes exist
- [ ] Set up backups

### Deployment
- [ ] Choose hosting platform
- [ ] Set up environment variables
- [ ] Configure domain/SSL
- [ ] Set up monitoring
- [ ] Set up error tracking

## Step 8: Documentation

- [ ] Read [README.md](./README.md)
- [ ] Read [QUICKSTART.md](./QUICKSTART.md)
- [ ] Read [BACKEND_SETUP.md](./BACKEND_SETUP.md)
- [ ] Read [FRONTEND_SETUP.md](./FRONTEND_SETUP.md)
- [ ] Read [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)
- [ ] Read [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

## Troubleshooting

### If Backend Won't Start
- [ ] Check Node.js version: `node --version` (should be 18+)
- [ ] Check port 5000 is free
- [ ] Reinstall dependencies: `rm -rf node_modules && npm install`
- [ ] Check .env file exists and is readable
- [ ] Check all required env variables are set

### If Email Not Sending
- [ ] Verify Gmail app password (16 characters)
- [ ] Check 2FA is enabled on Google account
- [ ] Verify EMAIL_USER matches Gmail address
- [ ] Check spam folder
- [ ] Look at backend logs for errors

### If Frontend Can't Connect
- [ ] Verify backend is running on port 5000
- [ ] Check NEXT_PUBLIC_API_URL in .env
- [ ] Check browser console for CORS errors
- [ ] Verify no firewall blocking port 5000

### If OTP Not Working
- [ ] Verify OTP is exactly 6 digits
- [ ] Check OTP hasn't expired (10 minutes)
- [ ] Verify email/phone matches what OTP was sent to
- [ ] Check backend logs for OTP errors

## Final Verification

- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:3000
- [ ] Email OTP login works
- [ ] Phone OTP login works
- [ ] User data persists
- [ ] Token stored in localStorage
- [ ] No console errors
- [ ] No backend errors
- [ ] Database has test user
- [ ] All documentation read

## Next Steps

1. ✅ Complete all checklist items
2. ✅ Test all features thoroughly
3. ✅ Customize UI as needed
4. ✅ Add additional features
5. ✅ Deploy to production

## Support

If you get stuck:
1. Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
2. Review relevant setup guide
3. Check browser console (F12)
4. Check backend logs
5. Verify all credentials

## Quick Commands Reference

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (in new terminal)
cd frontend
npm install
npm run dev

# Test backend
curl http://localhost:5000/health

# Test OTP endpoint
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

---

**Estimated Time: 30-45 minutes**

Start with [QUICKSTART.md](./QUICKSTART.md) for immediate setup.
