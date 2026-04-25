# SmartFetch Integration Guide

Complete guide for integrating backend and frontend authentication.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Components (auth-screen-backend.tsx)                │   │
│  │  - Email OTP login                                   │   │
│  │  - Phone OTP login                                   │   │
│  │  - OTP verification                                  │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Services (auth.service.ts)                          │   │
│  │  - sendOTP()                                         │   │
│  │  - verifyOTP()                                       │   │
│  │  - resendOTP()                                       │   │
│  │  - logout()                                          │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  API Client (config/api.ts)                          │   │
│  │  - Axios with interceptors                           │   │
│  │  - Token management                                  │   │
│  │  - Error handling                                    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           ↓ HTTP
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Express.js)                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Routes (routes/auth.routes.ts)                      │   │
│  │  - POST /api/auth/send-otp                           │   │
│  │  - POST /api/auth/verify-otp                         │   │
│  │  - POST /api/auth/resend-otp                         │   │
│  │  - POST /api/auth/logout                             │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Services                                            │   │
│  │  - OTP Service (otp.service.ts)                      │   │
│  │  - Email Service (email.service.ts)                  │   │
│  │  - Redis Service (redis.service.ts)                  │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  External Services                                   │   │
│  │  - Supabase (Database)                               │   │
│  │  - Gmail (Email)                                     │   │
│  │  - Redis (Cache)                                     │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Authentication Flow

### Email OTP Login

```
1. User enters email and clicks "Send OTP"
   ↓
2. Frontend calls POST /api/auth/send-otp
   ↓
3. Backend generates 6-digit OTP
   ↓
4. Backend stores OTP in Redis (10 min expiry)
   ↓
5. Backend sends OTP via Gmail
   ↓
6. User receives email with OTP
   ↓
7. User enters OTP and clicks "Verify OTP"
   ↓
8. Frontend calls POST /api/auth/verify-otp
   ↓
9. Backend verifies OTP against Redis
   ↓
10. Backend checks if user exists in Supabase
    - If exists: Load user data
    - If new: Create user account
   ↓
11. Backend generates JWT token
   ↓
12. Frontend stores token in localStorage
   ↓
13. User is logged in
```

### Phone OTP Login

```
Same as email, but:
- Phone number is converted to email format: +91XXXXXXXXXX
- OTP is sent via email (for now)
- User data includes phone number
```

## Data Flow

### Send OTP Request

```
Frontend:
{
  "email": "user@example.com",
  "userName": "John Doe"
}
        ↓
Backend:
1. Validate email format
2. Check rate limit (30 sec wait)
3. Generate 6-digit OTP
4. Store in Redis: otp:{email} = {otp, attempts, expiresAt}
5. Send email via Nodemailer
6. Return success response
```

### Verify OTP Request

```
Frontend:
{
  "email": "user@example.com",
  "otp": "123456"
}
        ↓
Backend:
1. Validate OTP format (6 digits)
2. Retrieve OTP from Redis
3. Check if expired
4. Check attempt limit (5 attempts)
5. Verify OTP matches
6. Query Supabase for user
7. If new user: Create account
8. Generate JWT token
9. Return user data + token
        ↓
Frontend:
1. Store token in localStorage
2. Store user data in state
3. Redirect to dashboard
```

## File Integration Points

### Frontend Components

**`components/auth-screen-backend.tsx`**
- Main authentication UI component
- Handles email and phone login
- Calls auth service methods
- Manages OTP state and timers

**`frontend/src/services/auth.service.ts`**
- API calls to backend
- Token management
- User data persistence

**`frontend/src/config/api.ts`**
- Axios client configuration
- Request/response interceptors
- Token injection in headers
- Error handling

**`frontend/src/hooks/useAuth.ts`**
- React hook for auth state
- Provides auth methods to components
- Manages loading and error states

### Backend Routes

**`backend/src/routes/auth.routes.ts`**
- POST /api/auth/send-otp
- POST /api/auth/verify-otp
- POST /api/auth/resend-otp
- POST /api/auth/check-otp-status
- POST /api/auth/logout

**`backend/src/routes/user.routes.ts`**
- GET /api/users/profile/:userId
- PUT /api/users/profile/:userId

### Backend Services

**`backend/src/services/otp.service.ts`**
- generateOTP() - Create 6-digit code
- sendOTP() - Store and rate limit
- verifyOTP() - Validate OTP
- getOTPStatus() - Check expiry

**`backend/src/services/email.service.ts`**
- sendOTPEmail() - Send OTP email
- sendVerificationEmail() - Confirmation
- sendWelcomeEmail() - New user welcome

**`backend/src/services/redis.service.ts`**
- cacheSet() - Store OTP
- cacheGet() - Retrieve OTP
- cacheDel() - Delete OTP
- Fallback to in-memory cache

## Environment Variables

### Backend (.env)

```env
# Supabase
SUPABASE_URL=https://project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=key_here

# Email
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=app_password_here

# JWT
JWT_SECRET=random_secret_string

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# OTP
OTP_LENGTH=6
OTP_EXPIRY_MINUTES=10
MAX_OTP_ATTEMPTS=5
OTP_RESEND_WAIT_SECONDS=30

# Redis
REDIS_URL=redis://localhost:6379
```

### Frontend (.env)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
VITE_SUPABASE_URL=https://project.supabase.co
VITE_SUPABASE_ANON_KEY=key_here
```

## API Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe"
  },
  "token": "jwt_token_here"
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description"
}
```

## Token Management

### JWT Token Structure

```
Header: {
  "alg": "HS256",
  "typ": "JWT"
}

Payload: {
  "userId": "uuid",
  "email": "user@example.com",
  "iat": 1234567890,
  "exp": 1234654290
}

Signature: HMACSHA256(header.payload, JWT_SECRET)
```

### Token Storage

Frontend stores token in localStorage:
```javascript
localStorage.setItem('auth_token', token)
```

Token is sent in every request:
```
Authorization: Bearer {token}
```

## Error Handling

### Frontend Error Handling

```typescript
try {
  const result = await authService.sendOTP({ email })
  if (result.success) {
    // Handle success
  } else {
    toast.error(result.message)
  }
} catch (err) {
  toast.error(err.response?.data?.message || 'Error')
}
```

### Backend Error Handling

```typescript
try {
  // Operation
} catch (error) {
  const apiError: ApiError = new Error(error.message)
  apiError.statusCode = 400
  throw apiError
}
```

## Testing the Integration

### 1. Test Send OTP

```bash
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","userName":"Test"}'
```

### 2. Test Verify OTP

```bash
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"123456"}'
```

### 3. Test Frontend

1. Open http://localhost:3000
2. Click Login
3. Enter email
4. Click Send OTP
5. Check email for OTP
6. Enter OTP
7. Click Verify

## Debugging

### Enable Debug Logging

Backend:
```env
LOG_LEVEL=debug
```

Frontend:
```javascript
// In browser console
localStorage.setItem('debug', '*')
```

### Check Network Requests

1. Open DevTools (F12)
2. Go to Network tab
3. Perform login
4. Check request/response

### Check Local Storage

1. Open DevTools (F12)
2. Go to Application → Local Storage
3. Check `auth_token` and `user` keys

## Production Considerations

1. **HTTPS Only** - Use HTTPS in production
2. **Secure Cookies** - Store token in secure HTTP-only cookie
3. **CORS** - Configure CORS properly
4. **Rate Limiting** - Implement rate limiting on OTP endpoints
5. **Email Verification** - Verify email ownership
6. **Phone Verification** - Use SMS service (Twilio)
7. **Monitoring** - Set up error tracking
8. **Logging** - Centralize logs
9. **Backup** - Regular database backups
10. **Security** - Regular security audits

## Next Steps

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Test authentication flow
4. Customize UI as needed
5. Deploy to production

For detailed setup, see:
- `BACKEND_SETUP.md`
- `FRONTEND_SETUP.md`
- `QUICKSTART.md`
