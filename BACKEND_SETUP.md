# Backend Setup Guide

Complete setup instructions for SmartFetch backend with email OTP authentication.

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- Gmail account with 2FA enabled
- Supabase project created
- Redis (optional, falls back to in-memory cache)

## Step 1: Get Gmail App Password

1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Windows Computer"
3. Google will generate a 16-character password
4. Copy this password (you'll need it in Step 3)

## Step 2: Get Supabase Credentials

1. Go to https://supabase.com and create a project
2. In Project Settings → API, copy:
   - **Project URL** (SUPABASE_URL)
   - **Service Role Key** (SUPABASE_SERVICE_ROLE_KEY)
3. Run the SQL files in Supabase SQL Editor:
   - `supabase-tables.sql` - Creates database tables
   - `supabase-rls-policies.sql` - Sets up Row Level Security

## Step 3: Configure Backend Environment

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and fill in:

```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_16_char_app_password

# JWT (change this to a random string)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## Step 4: Install Dependencies

```bash
cd backend
npm install
```

## Step 5: Start Backend Server

```bash
npm run dev
```

You should see:
```
Server running on http://localhost:5000
Email service initialized
Redis initialized
```

## Step 6: Test Backend

### Send OTP
```bash
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","userName":"Test User"}'
```

Expected response:
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "expiresIn": 600
}
```

### Verify OTP
```bash
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"123456"}'
```

Expected response:
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "test@example.com",
    "full_name": "Test User"
  },
  "token": "jwt_token_here"
}
```

## Troubleshooting

### Email not sending
- Verify Gmail app password is correct (16 characters)
- Check 2FA is enabled on Google account
- Ensure EMAIL_USER matches your Gmail address
- Check spam folder

### Supabase connection errors
- Verify SUPABASE_URL format: `https://xxxxx.supabase.co`
- Check SUPABASE_SERVICE_ROLE_KEY is correct
- Ensure database tables exist (run SQL files)
- Check RLS policies are configured

### Redis connection failed
- Backend automatically falls back to in-memory cache
- For production, ensure Redis is running on REDIS_URL
- Check Redis connection string format

### OTP not working
- Verify OTP_LENGTH=6 in .env
- Check OTP_EXPIRY_MINUTES=10
- Ensure Redis or in-memory cache is working
- Check email service logs

## API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP to email
- `POST /api/auth/verify-otp` - Verify OTP and login
- `POST /api/auth/resend-otp` - Resend OTP
- `POST /api/auth/check-otp-status` - Check OTP status
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users/profile/:userId` - Get user profile
- `PUT /api/users/profile/:userId` - Update user profile

### Health
- `GET /health` - Server health check

## Production Deployment

1. Set `NODE_ENV=production`
2. Use strong JWT_SECRET
3. Set up Redis for production
4. Configure CORS properly
5. Use environment variables from secure vault
6. Enable HTTPS
7. Set up monitoring and logging

## Next Steps

1. Start the backend: `npm run dev`
2. Configure frontend to use backend API
3. Test authentication flow
4. Deploy to production

For frontend setup, see `FRONTEND_SETUP.md`
