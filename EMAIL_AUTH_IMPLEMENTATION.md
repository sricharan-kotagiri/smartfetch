# Email Verification Authentication System - Implementation Guide

## Overview
This guide explains the complete Email Verification Authentication System for SmartFetch. The system allows users to sign up with email, receive verification emails, and log in only after email verification. Phone authentication remains unchanged.

## 🎯 Key Features

✅ **Email Signup with Verification**
- Users create account with email + password
- Password strength validation (8+ chars, uppercase, lowercase, number, special char)
- Verification email sent automatically
- User cannot login until email is verified

✅ **Email Login**
- Login with email + password
- Blocks login if email not verified
- Clear error message directing to verification

✅ **Email Verification**
- Secure token-based verification
- 24-hour token expiry
- Resend verification email option
- One-click verification link

✅ **Phone Authentication Preserved**
- Existing WhatsApp OTP system unchanged
- Both auth methods work independently

## 📁 Files Created

### Backend Services
1. **`backend/src/services/email-verification.service.ts`**
   - `sendVerificationEmail()` - Send verification email with token
   - `verifyEmailToken()` - Verify token and mark user as verified
   - `resendVerificationEmail()` - Resend verification email
   - `isEmailVerified()` - Check verification status
   - `getUserByEmail()` - Get user by email

2. **`backend/src/services/password.service.ts`**
   - `hashPassword()` - Hash password with bcrypt
   - `comparePassword()` - Compare password with hash
   - `validatePasswordStrength()` - Validate password requirements

### Backend Routes
3. **`backend/src/routes/email-auth.routes.ts`**
   - `POST /api/auth/email/signup` - Register new user
   - `POST /api/auth/email/login` - Login with email
   - `POST /api/auth/email/verify` - Verify email token
   - `POST /api/auth/email/resend-verification` - Resend verification email
   - `GET /api/auth/email/verification-status/:email` - Check verification status

### Database Schema
4. **`supabase-email-auth-schema.sql`**
   - Add `email`, `email_verified_at`, `password_hash`, `auth_method` to users table
   - Create `email_verification_tokens` table
   - Create `password_reset_tokens` table
   - Create `email_logs` table
   - Add RLS policies for security

### Frontend Services
5. **`frontend/src/services/email-auth.service.ts`**
   - `signup()` - Call signup endpoint
   - `login()` - Call login endpoint
   - `verifyEmail()` - Verify email token
   - `resendVerification()` - Resend verification email
   - `checkVerificationStatus()` - Check if email verified
   - `getCurrentUser()` - Get logged-in user
   - `isAuthenticated()` - Check auth status
   - `logout()` - Clear auth data

### Frontend Components
6. **`frontend/src/components/EmailSignup.tsx`**
   - Email signup form with password strength indicator
   - Real-time password validation
   - Error handling and success messages

7. **`frontend/src/components/EmailLogin.tsx`**
   - Email login form
   - Error handling for unverified emails
   - Link to resend verification

### Frontend Pages
8. **`frontend/src/pages/verify-email.tsx`**
   - Email verification page (accessed via link in email)
   - Shows verification status
   - Redirects to login on success

9. **`frontend/src/pages/verify-email-pending.tsx`**
   - Shows after signup
   - Displays email address
   - Resend verification email button

10. **`frontend/src/pages/resend-verification.tsx`**
    - Standalone page to resend verification email
    - Email input form
    - Success/error messages

11. **`frontend/src/pages/auth-combined.tsx`**
    - Combined auth page with method selection
    - Email login, email signup, phone options
    - Easy switching between methods

## 🚀 Setup Instructions

### 1. Database Setup
Run the SQL schema in Supabase:
```sql
-- Execute supabase-email-auth-schema.sql in Supabase SQL Editor
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install bcrypt
npm install --save-dev @types/bcrypt
```

#### Update .env
```env
# Email Service
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Email Verification
EMAIL_VERIFICATION_TOKEN_EXPIRY_HOURS=24
EMAIL_VERIFICATION_RESEND_WAIT_SECONDS=60

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

# Frontend URL (for verification links)
FRONTEND_URL=http://localhost:3000
```

#### Start Backend
```bash
npm run dev
```

### 3. Frontend Setup

#### Update Routes
Add these routes to your router configuration:

```typescript
// In your main router file
import AuthCombinedPage from '@/pages/auth-combined'
import VerifyEmailPage from '@/pages/verify-email'
import VerifyEmailPendingPage from '@/pages/verify-email-pending'
import ResendVerificationPage from '@/pages/resend-verification'

const routes = [
  {
    path: '/auth',
    children: [
      { path: 'login', element: <AuthCombinedPage /> },
      { path: 'signup', element: <AuthCombinedPage /> },
      { path: 'verify-email', element: <VerifyEmailPage /> },
      { path: 'verify-email-pending', element: <VerifyEmailPendingPage /> },
      { path: 'resend-verification', element: <ResendVerificationPage /> },
    ]
  }
]
```

#### Update API Client
Ensure `frontend/src/config/api.ts` has correct backend URL:
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
```

## 📊 User Flows

### New User Signup Flow
```
1. User visits /auth/signup
2. Selects "Sign Up with Email"
3. Fills form: email, password, name (optional), phone (optional)
4. Clicks "Create Account"
5. Backend:
   - Validates password strength
   - Hashes password
   - Creates user in database
   - Generates verification token
   - Sends verification email
6. Frontend shows: "Check your email to verify"
7. User clicks link in email
8. Verification page confirms email
9. User can now login
```

### Existing User Login Flow
```
1. User visits /auth/login
2. Selects "Log In with Email"
3. Enters email + password
4. Backend:
   - Finds user by email
   - Checks if email_verified_at is NOT NULL
   - If not verified: returns error "Please verify your email"
   - If verified: compares password
   - If valid: generates JWT token
5. Frontend stores token and redirects to dashboard/home
```

### Email Verification Flow
```
1. User receives email with verification link
2. Link format: https://frontend.com/auth/verify-email?token=xxx
3. User clicks link
4. Frontend extracts token from URL
5. Calls /api/auth/email/verify with token
6. Backend:
   - Finds token in database
   - Checks if expired (24 hours)
   - Updates user.email_verified_at
   - Deletes used token
7. Frontend shows success message
8. Redirects to login
```

### Resend Verification Flow
```
1. User clicks "Resend Verification Email"
2. Enters email address
3. Backend:
   - Finds user by email
   - Checks if already verified
   - Deletes old tokens
   - Generates new token
   - Sends new verification email
4. Frontend shows success message
```

## 🔒 Security Features

✅ **Password Security**
- Bcrypt hashing with 10 salt rounds
- Password strength validation
- Never stored in plain text

✅ **Token Security**
- Cryptographically secure tokens (32 bytes)
- 24-hour expiry
- One-time use (deleted after verification)
- Stored in database with user_id

✅ **Email Security**
- Verification link includes token
- Token validated before marking verified
- Email logs track all email sends

✅ **Rate Limiting**
- Resend verification: 60 seconds between attempts
- Login attempts: Standard JWT expiry

✅ **Database Security**
- RLS policies on all tables
- Users can only see their own data
- Service role key for backend operations

## 🧪 Testing

### Test Signup
```bash
curl -X POST http://localhost:5000/api/auth/email/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@1234",
    "confirmPassword": "Test@1234",
    "name": "Test User"
  }'
```

### Test Login (Before Verification)
```bash
curl -X POST http://localhost:5000/api/auth/email/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@1234"
  }'
# Expected: Error "Please verify your email before logging in"
```

### Test Email Verification
```bash
# Get token from email or database
curl -X POST http://localhost:5000/api/auth/email/verify \
  -H "Content-Type: application/json" \
  -d '{
    "token": "token_from_email"
  }'
```

### Test Login (After Verification)
```bash
curl -X POST http://localhost:5000/api/auth/email/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@1234"
  }'
# Expected: Success with JWT token
```

## 📝 API Endpoints

### Signup
- **Endpoint**: `POST /api/auth/email/signup`
- **Body**: `{ email, password, confirmPassword, name?, phone?, role? }`
- **Response**: `{ success, message, user }`
- **Status**: 201 (Created) or 400/409 (Error)

### Login
- **Endpoint**: `POST /api/auth/email/login`
- **Body**: `{ email, password }`
- **Response**: `{ success, message, user, token }`
- **Status**: 200 (OK) or 401/403 (Error)

### Verify Email
- **Endpoint**: `POST /api/auth/email/verify`
- **Body**: `{ token }`
- **Response**: `{ success, message }`
- **Status**: 200 (OK) or 400 (Error)

### Resend Verification
- **Endpoint**: `POST /api/auth/email/resend-verification`
- **Body**: `{ email }`
- **Response**: `{ success, message }`
- **Status**: 200 (OK) or 400/404 (Error)

### Check Verification Status
- **Endpoint**: `GET /api/auth/email/verification-status/:email`
- **Response**: `{ success, email, verified, verifiedAt }`
- **Status**: 200 (OK) or 404 (Error)

## 🐛 Troubleshooting

### Email Not Sending
- Check EMAIL_USER and EMAIL_PASSWORD in .env
- For Gmail: Use App Password, not regular password
- Check email service logs

### Verification Link Not Working
- Ensure FRONTEND_URL in .env is correct
- Check token expiry (24 hours)
- Verify token exists in database

### Login Blocked After Verification
- Check email_verified_at is set in database
- Verify token was deleted after use
- Check JWT_SECRET is consistent

### Password Validation Failing
- Ensure password has: 8+ chars, uppercase, lowercase, number, special char
- Check password requirements in frontend and backend match

## 📚 Additional Resources

- [Bcrypt Documentation](https://github.com/kelektiv/node.bcrypt.js)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)
- [OWASP Password Guidelines](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

## ✅ Checklist

- [ ] Database schema applied in Supabase
- [ ] Backend dependencies installed (bcrypt)
- [ ] Backend .env configured with email service
- [ ] Backend server running on correct port
- [ ] Frontend routes added
- [ ] Frontend API client configured
- [ ] Email service tested (send test email)
- [ ] Signup flow tested end-to-end
- [ ] Verification email received and link works
- [ ] Login blocked before verification
- [ ] Login works after verification
- [ ] Phone auth still works
- [ ] Resend verification email works
- [ ] Error messages display correctly

## 🎉 Success Indicators

✅ User can signup with email
✅ Verification email is sent automatically
✅ User cannot login until email verified
✅ Verification link works and marks email as verified
✅ User can login after verification
✅ Phone authentication still works
✅ Shops created are visible to customers
✅ All error messages are clear and helpful
