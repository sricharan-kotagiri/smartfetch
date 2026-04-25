# SmartFetch - Complete Authentication System

Production-ready phone OTP authentication with WhatsApp (Twilio) and Express backend + Vite React frontend.

## 🚀 Quick Start

Get up and running in 5 minutes:

```bash
# 1. Configure backend
cd backend
cp .env.example .env
# Edit .env with Supabase and Twilio credentials

# 2. Start backend
npm install
npm run dev

# 3. In another terminal, start frontend
cd frontend
npm install
npm run dev

# 4. Open http://localhost:3000
```

See [QUICKSTART.md](./QUICKSTART.md) for detailed instructions.

## 📋 What's Included

### Backend (Express.js + TypeScript)
- ✅ Email OTP authentication
- ✅ Phone OTP authentication (Indian format: +91)
- ✅ 6-digit OTP with 10-minute expiry
- ✅ Rate limiting and attempt limits
- ✅ JWT token generation
- ✅ Supabase integration
- ✅ Redis caching (with in-memory fallback)
- ✅ Comprehensive error handling
- ✅ Production-ready logging

### Frontend (Vite + React)
- ✅ Phone login with WhatsApp OTP only
- ✅ OTP verification UI
- ✅ Token management
- ✅ User state management
- ✅ Error handling and notifications
- ✅ Responsive design

### Database (Supabase)
- ✅ Users table
- ✅ Shops table
- ✅ Products table
- ✅ Orders table
- ✅ Row Level Security policies
- ✅ Proper indexes and relationships

## 📁 Project Structure

```
smartfetch/
├── backend/                    # Express.js backend
│   ├── src/
│   │   ├── server.ts          # Main server
│   │   ├── config/            # Configuration
│   │   ├── services/          # Business logic
│   │   ├── routes/            # API endpoints
│   │   └── middleware/        # Express middleware
│   ├── .env                   # Configuration
│   └── package.json
│
├── frontend/                   # Next.js frontend
│   ├── src/
│   │   ├── config/            # API client
│   │   ├── services/          # API calls
│   │   ├── hooks/             # React hooks
│   │   └── pages/             # Next.js pages
│   ├── .env                   # Configuration
│   └── package.json
│
├── components/                # Shared components
├── lib/                       # Shared utilities
├── supabase-*.sql             # Database schemas
│
└── Documentation/
    ├── QUICKSTART.md          # 5-minute setup
    ├── BACKEND_SETUP.md       # Backend guide
    ├── FRONTEND_SETUP.md      # Frontend guide
    ├── INTEGRATION_GUIDE.md   # Architecture details
    ├── TROUBLESHOOTING.md     # Common issues
    └── DEVELOPMENT_COMPLETE.md # What's been built
```

## 🔐 Authentication Flow

### Email OTP
1. User enters email → Click "Send OTP"
2. Backend generates 6-digit OTP
3. OTP sent via Gmail
4. User enters OTP → Click "Verify"
5. Backend verifies OTP
6. User created/logged in
7. JWT token returned
8. User logged in ✅

### Phone OTP
1. User enters 10-digit phone → Click "Send OTP"
2. Backend generates 6-digit OTP
3. OTP sent via email (for now)
4. User enters OTP → Click "Verify"
5. Backend verifies OTP
6. User created/logged in
7. JWT token returned
8. User logged in ✅

## 🛠️ Prerequisites

- Node.js 18+
- npm or yarn
- Gmail account with 2FA enabled
- Supabase account
- Redis (optional, falls back to in-memory)

## 📝 Setup Steps

### 1. Get Credentials

**Gmail App Password:**
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Windows Computer"
3. Copy 16-character password

**Supabase:**
1. Create project at https://supabase.com
2. Copy Project URL and Service Role Key
3. Run SQL files in Supabase SQL Editor

### 2. Configure Backend

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
JWT_SECRET=random_secret_string
```

### 3. Start Backend

```bash
cd backend
npm install
npm run dev
```

### 4. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

### 5. Test

Open http://localhost:3000 and test login

## 🔌 API Endpoints

### Authentication
```
POST /api/auth/send-otp       - Send OTP to email
POST /api/auth/verify-otp     - Verify OTP and login
POST /api/auth/resend-otp     - Resend OTP
POST /api/auth/logout         - Logout user
```

### Users
```
GET  /api/users/profile/:userId    - Get user profile
PUT  /api/users/profile/:userId    - Update profile
```

## 📚 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - 5-minute setup guide
- **[BACKEND_SETUP.md](./BACKEND_SETUP.md)** - Detailed backend setup
- **[FRONTEND_SETUP.md](./FRONTEND_SETUP.md)** - Detailed frontend setup
- **[INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)** - Architecture and integration
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Common issues and solutions
- **[DEVELOPMENT_COMPLETE.md](./DEVELOPMENT_COMPLETE.md)** - What's been built
- **[backend/README.md](./backend/README.md)** - Backend documentation
- **[frontend/README.md](./frontend/README.md)** - Frontend documentation

## 🧪 Testing

### Test Backend Directly

```bash
# Send OTP
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","userName":"Test"}'

# Verify OTP
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"123456"}'
```

### Test Frontend

1. Open http://localhost:3000
2. Click "Login"
3. Enter email or phone
4. Click "Send OTP"
5. Check email for OTP
6. Enter OTP and verify
7. You're logged in!

## 🔒 Security Features

- ✅ JWT token authentication
- ✅ OTP rate limiting (30-second wait)
- ✅ OTP attempt limits (5 attempts)
- ✅ OTP expiry (10 minutes)
- ✅ Row Level Security (RLS)
- ✅ CORS protection
- ✅ Input validation
- ✅ Error handling

## 🚀 Deployment

### Backend Deployment

```bash
# Build
npm run build

# Start
npm start
```

### Frontend Deployment

```bash
# Build
npm run build

# Start
npm start
```

Set environment variables in your hosting platform.

## 📊 Environment Variables

### Backend (.env)
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
JWT_SECRET=random_secret
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
OTP_LENGTH=6
OTP_EXPIRY_MINUTES=10
MAX_OTP_ATTEMPTS=5
OTP_RESEND_WAIT_SECONDS=30
REDIS_URL=redis://localhost:6379
LOG_LEVEL=debug
```

### Frontend (.env)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_key
VITE_APP_NAME=SmartFetch
VITE_NODE_ENV=development
```

## 🐛 Troubleshooting

### Backend won't start
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Email not sending
- Verify Gmail app password (16 characters)
- Check 2FA is enabled
- Verify EMAIL_USER matches Gmail address

### Frontend can't connect to backend
- Check backend is running on port 5000
- Verify NEXT_PUBLIC_API_URL in .env
- Check browser console for CORS errors

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for more solutions.

## 📞 Support

For issues:
1. Check relevant setup guide
2. Review [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
3. Check browser console (F12)
4. Check backend logs
5. Verify environment variables

## 📄 License

MIT

## 🎯 Next Steps

1. ✅ Complete setup following [QUICKSTART.md](./QUICKSTART.md)
2. ✅ Test authentication flow
3. ✅ Customize UI components
4. ✅ Add additional features
5. ✅ Deploy to production

## 📈 Features Coming Soon

- SMS OTP via Twilio
- Social login (Google, GitHub)
- Two-factor authentication
- Email verification
- Password reset
- User roles and permissions
- Admin dashboard

## 🤝 Contributing

Contributions welcome! Please follow the existing code style and add tests.

---

**Status: Ready for Development** 🚀

Start with [QUICKSTART.md](./QUICKSTART.md) for immediate setup.
