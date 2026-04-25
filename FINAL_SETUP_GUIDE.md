# SmartFetch - Final Setup Guide

Complete step-by-step guide to set up and run the entire SmartFetch application.

## ✅ Prerequisites

- Node.js 16+ installed
- npm or yarn
- Redis server installed
- Supabase account
- Gmail account with 2FA enabled

## 🎯 Step 1: Get Required Credentials

### Gmail App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Windows Computer"
3. Generate and copy the 16-character password
4. Save for later

### Supabase Service Role Key
1. Go to Supabase Dashboard
2. Click Settings → API
3. Copy "Service Role" key
4. Save for later

## 📁 Step 2: Project Structure

Your project should look like:
```
smartfetch/
├── frontend/          # Next.js + Vite
├── backend/           # Express.js
├── docs/              # Documentation
└── README.md
```

## 🔧 Step 3: Frontend Setup

### 3.1 Install Dependencies
```bash
cd frontend
npm install
```

### 3.2 Configure Environment
```bash
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000
VITE_SUPABASE_URL=https://sxghctohznlmuuyzyaut.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3.3 Test Frontend
```bash
npm run dev
```

Open http://localhost:3000 in browser

## 🔧 Step 4: Backend Setup

### 4.1 Install Dependencies
```bash
cd backend
npm install
```

### 4.2 Configure Environment
```bash
cp .env.example .env
```

Edit `backend/.env`:
```env
SUPABASE_URL=https://sxghctohznlmuuyzyaut.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password_here
REDIS_URL=redis://localhost:6379
```

### 4.3 Create Database Table

1. Go to Supabase Dashboard
2. Click "SQL Editor"
3. Click "New Query"
4. Paste:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  phone TEXT UNIQUE,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
```

5. Click "Run"

### 4.4 Start Redis

**Windows:**
```bash
redis-server
```

**Mac (Homebrew):**
```bash
brew services start redis
```

**Linux:**
```bash
sudo systemctl start redis-server
```

**Docker:**
```bash
docker run -d -p 6379:6379 redis:latest
```

### 4.5 Test Backend
```bash
npm run dev
```

You should see:
```
╔════════════════════════════════════════╗
║   SmartFetch Backend Server Started    ║
╠════════════════════════════════════════╣
║ 🚀 Server running on port 5000
```

## 🧪 Step 5: Test the Application

### 5.1 Test Backend API

```bash
# Send OTP
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"your_email@gmail.com","userName":"Test"}'

# Response should be:
# {"success":true,"message":"OTP sent to your_email@gmail.com..."}
```

### 5.2 Check Email

1. Check your email for OTP code
2. Copy the 6-digit code

### 5.3 Verify OTP

```bash
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"your_email@gmail.com","otp":"123456"}'

# Replace 123456 with actual OTP from email
```

### 5.4 Test Frontend

1. Go to http://localhost:3000
2. Click "Get Started as Customer"
3. Select "Phone" tab
4. Enter phone number: 9876543210
5. Click "Send OTP"
6. Enter OTP: 123456 (demo mode)
7. Click "Verify OTP"
8. Accept terms
9. Should see dashboard

## 📊 Running Everything Together

### Terminal 1 - Redis
```bash
redis-server
```

### Terminal 2 - Backend
```bash
cd backend
npm run dev
```

### Terminal 3 - Frontend
```bash
cd frontend
npm run dev
```

### Terminal 4 - Browser
```
http://localhost:3000
```

## 🔐 Security Checklist

- [ ] Gmail 2FA enabled
- [ ] App password generated
- [ ] Supabase credentials in .env
- [ ] Redis running
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] No credentials in git
- [ ] .env files in .gitignore

## 🆘 Troubleshooting

### Redis Connection Failed
```bash
# Check Redis is running
redis-cli ping
# Should return: PONG
```

### Email Not Sending
- Verify Gmail 2FA is enabled
- Check app password is correct (16 chars)
- Verify EMAIL_USER in .env
- Check backend logs

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📋 File Checklist

### Frontend
- [ ] `frontend/.env` created
- [ ] `frontend/src/config/supabase.ts` exists
- [ ] `frontend/src/config/api.ts` exists
- [ ] `frontend/src/services/auth.service.ts` exists
- [ ] `frontend/src/hooks/useAuth.ts` exists

### Backend
- [ ] `backend/.env` created
- [ ] `backend/src/server.ts` exists
- [ ] `backend/src/config/supabase.ts` exists
- [ ] `backend/src/services/email.service.ts` exists
- [ ] `backend/src/services/otp.service.ts` exists
- [ ] `backend/src/services/redis.service.ts` exists
- [ ] `backend/src/routes/auth.routes.ts` exists

## 🎯 Next Steps

1. ✅ Complete all setup steps above
2. ✅ Test backend API with curl
3. ✅ Test frontend in browser
4. ✅ Test end-to-end OTP flow
5. ✅ Verify user data in Supabase
6. ✅ Deploy to production

## 📚 Documentation

- `PROJECT_STRUCTURE.md` - Project organization
- `frontend/README.md` - Frontend docs
- `backend/README.md` - Backend docs
- `SETUP_CHECKLIST.md` - Detailed checklist

## 🚀 Production Deployment

### Before Deploying

1. Change NODE_ENV to production
2. Update FRONTEND_URL to production domain
3. Change JWT_SECRET to strong random value
4. Set up HTTPS
5. Configure production email service
6. Set up production Redis
7. Enable Supabase RLS policies

### Deploy Frontend
```bash
cd frontend
npm run build
# Deploy dist/ folder to Vercel/Netlify
```

### Deploy Backend
```bash
cd backend
npm run build
# Deploy to Heroku/Railway/AWS
```

## ✨ Features Ready to Use

- ✅ Email OTP authentication
- ✅ User registration
- ✅ User login
- ✅ User profile management
- ✅ Real-time email verification
- ✅ Rate limiting
- ✅ Error handling
- ✅ Logging
- ✅ Security headers
- ✅ CORS protection

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section
2. Review backend logs
3. Check browser console
4. Check network tab in DevTools
5. Verify all environment variables
6. Ensure all services are running

---

**Status**: ✅ Ready for development and testing!

**Next Action**: Follow the steps above and test the application!
