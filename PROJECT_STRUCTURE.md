# SmartFetch Project Structure

Complete project organization with separate frontend and backend folders.

## 📁 Project Layout

```
smartfetch/
├── frontend/                    # Next.js + Vite Frontend
│   ├── src/
│   │   ├── config/
│   │   │   ├── supabase.ts     # Supabase client
│   │   │   └── api.ts          # API client with axios
│   │   ├── services/
│   │   │   └── auth.service.ts # Authentication service
│   │   ├── hooks/
│   │   │   └── useAuth.ts      # Auth hook
│   │   ├── components/         # React components
│   │   ├── pages/              # Page components
│   │   ├── styles/             # Global styles
│   │   └── App.tsx             # Main app
│   ├── .env                    # Environment variables
│   ├── .env.example            # Environment template
│   ├── vite.config.ts          # Vite configuration
│   ├── tsconfig.json           # TypeScript config
│   ├── package.json            # Dependencies
│   └── README.md               # Frontend docs
│
├── backend/                     # Express.js Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── supabase.ts     # Supabase client
│   │   ├── middleware/
│   │   │   ├── errorHandler.ts # Error handling
│   │   │   └── logger.ts       # Logging
│   │   ├── routes/
│   │   │   ├── auth.routes.ts  # Auth endpoints
│   │   │   ├── otp.routes.ts   # OTP endpoints
│   │   │   └── user.routes.ts  # User endpoints
│   │   ├── services/
│   │   │   ├── email.service.ts    # Email service
│   │   │   ├── otp.service.ts      # OTP service
│   │   │   └── redis.service.ts    # Redis service
│   │   └── server.ts           # Main server
│   ├── .env                    # Environment variables
│   ├── .env.example            # Environment template
│   ├── package.json            # Dependencies
│   ├── tsconfig.json           # TypeScript config
│   └── README.md               # Backend docs
│
├── docs/                        # Documentation
│   ├── SETUP.md                # Setup guide
│   ├── API.md                  # API documentation
│   └── ARCHITECTURE.md         # Architecture overview
│
├── PROJECT_STRUCTURE.md        # This file
├── SETUP_CHECKLIST.md          # Setup checklist
└── README.md                   # Main README
```

## 🚀 Quick Start

### 1. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend runs on `http://localhost:3000`

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

Backend runs on `http://localhost:5000`

## 📋 Environment Variables

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000
VITE_SUPABASE_URL=https://sxghctohznlmuuyzyaut.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Backend (.env)

```env
SUPABASE_URL=https://sxghctohznlmuuyzyaut.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
REDIS_URL=redis://localhost:6379
```

## 🔗 Communication Flow

```
Frontend (Port 3000)
    ↓
Vite Dev Server
    ↓
API Client (axios)
    ↓
Backend (Port 5000)
    ↓
Express Server
    ↓
Services (Email, OTP, Redis)
    ↓
Supabase Database
```

## 📊 Technology Stack

### Frontend
- **Framework**: Next.js 14
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Database**: Supabase

### Backend
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: Supabase PostgreSQL
- **Cache**: Redis
- **Email**: Nodemailer
- **Authentication**: JWT

## 🔐 Security

- Environment variables for secrets
- JWT token authentication
- CORS protection
- Rate limiting
- Input validation
- Error handling

## 📝 File Organization Rules

### Frontend
- Components in `src/components/`
- Pages in `src/pages/`
- Services in `src/services/`
- Hooks in `src/hooks/`
- Config in `src/config/`
- Styles in `src/styles/`

### Backend
- Routes in `src/routes/`
- Services in `src/services/`
- Middleware in `src/middleware/`
- Config in `src/config/`
- Main server in `src/server.ts`

## 🚀 Development Workflow

1. **Start Redis**
   ```bash
   redis-server
   ```

2. **Start Backend**
   ```bash
   cd backend
   npm run dev
   ```

3. **Start Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

4. **Access Application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000
   - API: http://localhost:5000/api

## 📦 Dependencies

### Frontend
- react, react-dom
- next
- @supabase/supabase-js
- axios
- tailwindcss
- typescript

### Backend
- express
- @supabase/supabase-js
- nodemailer
- redis, ioredis
- jsonwebtoken
- typescript

## 🧪 Testing

### Frontend
```bash
cd frontend
npm run dev
# Open http://localhost:3000
```

### Backend
```bash
cd backend
npm run dev
# Test with curl or Postman
```

## 📚 Documentation

- `frontend/README.md` - Frontend documentation
- `backend/README.md` - Backend documentation
- `SETUP_CHECKLIST.md` - Setup checklist
- `PROJECT_STRUCTURE.md` - This file

## 🔄 Git Structure

```
.gitignore
├── node_modules/
├── dist/
├── .env (local only)
├── .next/
└── .DS_Store
```

## 🚀 Deployment

### Frontend
- Build: `npm run build`
- Deploy to: Vercel, Netlify, AWS S3

### Backend
- Build: `npm run build`
- Deploy to: Heroku, Railway, AWS EC2

## 🆘 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Environment Variables Not Loading
- Check `.env` file exists
- Restart dev server
- Verify variable names match

## 📞 Support

For issues:
1. Check documentation files
2. Review error messages
3. Check backend logs
4. Check browser console
5. Check network tab

---

**Status**: ✅ Project structure complete and ready for development!
