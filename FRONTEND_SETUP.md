# Frontend Setup Guide

Complete setup instructions for SmartFetch frontend with Next.js.

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- Backend running on http://localhost:5000

## Step 1: Install Dependencies

```bash
cd frontend
npm install
```

## Step 2: Configure Environment Variables

The frontend uses Next.js environment variables. Edit `frontend/.env`:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000

# Supabase (optional, for future use)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# Application Settings
VITE_APP_NAME=SmartFetch
VITE_NODE_ENV=development
```

## Step 3: Start Frontend Development Server

```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

## Step 4: Test Authentication

1. Open http://localhost:3000 in your browser
2. Click "Login" or "Sign Up"
3. Choose authentication method:
   - **Email**: Enter email and click "Send OTP"
   - **Phone**: Enter 10-digit Indian phone number and click "Send OTP"
4. Check your email/phone for OTP
5. Enter OTP and click "Verify OTP"
6. You should be logged in

## Frontend Structure

```
frontend/
├── src/
│   ├── config/
│   │   ├── api.ts          # Axios client with interceptors
│   │   └── supabase.ts     # Supabase client (optional)
│   ├── services/
│   │   └── auth.service.ts # Authentication API calls
│   ├── hooks/
│   │   └── useAuth.ts      # Auth hook for components
│   └── pages/              # Next.js pages
├── .env                    # Environment variables
├── .env.example            # Example env file
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Key Files

### `src/config/api.ts`
Axios client with:
- Base URL from environment
- Request/response interceptors
- Token management
- Error handling

### `src/services/auth.service.ts`
Authentication service with methods:
- `sendOTP(email, userName)` - Send OTP
- `verifyOTP(email, otp)` - Verify OTP
- `resendOTP(email, userName)` - Resend OTP
- `logout()` - Logout user
- `isAuthenticated()` - Check auth status

### `src/hooks/useAuth.ts`
React hook for authentication:
- `user` - Current user object
- `loading` - Loading state
- `error` - Error message
- `sendOTP()` - Send OTP function
- `verifyOTP()` - Verify OTP function
- `logout()` - Logout function

## Using Authentication in Components

```tsx
import { useAuth } from '@/hooks/useAuth'

export function MyComponent() {
  const { user, loading, sendOTP, verifyOTP } = useAuth()

  if (loading) return <div>Loading...</div>
  if (!user) return <div>Not logged in</div>

  return <div>Welcome, {user.full_name}!</div>
}
```

## API Integration

The frontend communicates with backend at `http://localhost:5000`:

### Send OTP
```
POST /api/auth/send-otp
{
  "email": "user@example.com",
  "userName": "John Doe"
}
```

### Verify OTP
```
POST /api/auth/verify-otp
{
  "email": "user@example.com",
  "otp": "123456"
}
```

### Resend OTP
```
POST /api/auth/resend-otp
{
  "email": "user@example.com",
  "userName": "John Doe"
}
```

## Troubleshooting

### API calls failing
- Check backend is running on http://localhost:5000
- Verify NEXT_PUBLIC_API_URL in .env
- Check browser console for CORS errors
- Ensure backend CORS is configured

### OTP not received
- Check backend email service is working
- Verify Gmail credentials in backend .env
- Check spam folder
- Look at backend logs for errors

### Authentication not persisting
- Check localStorage is enabled
- Verify token is being stored
- Check browser DevTools → Application → Local Storage

### Build errors
- Run `npm install` to ensure all dependencies
- Check Node.js version is 18+
- Clear `.next` folder: `rm -rf .next`
- Try `npm run build` to see full errors

## Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type check
npm run type-check

# Lint code
npm run lint
```

## Production Build

```bash
npm run build
npm start
```

## Environment Variables for Production

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
VITE_APP_NAME=SmartFetch
VITE_NODE_ENV=production
```

## Next Steps

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Open http://localhost:3000
4. Test authentication flow
5. Deploy to production

For backend setup, see `BACKEND_SETUP.md`
