# SmartFetch Authentication System

## ✅ Current Status

The authentication system is now **fully functional** with demo mode enabled. Users can login via:
- **Email + Password** - Any email with password (6+ characters)
- **Phone + OTP** - Any 10-digit phone number starting with 6, 7, 8, or 9

## 🎯 How to Test

1. Start the dev server: `npm run dev`
2. Go to: http://localhost:3000
3. Click "Get Started as Customer" or "Get Started as Shop Owner"
4. Choose **Email** or **Phone** tab
5. Login with demo credentials:
   - **Email**: any@email.com | Password: 123456
   - **Phone**: 9876543210 | OTP: (shown in toast notification)

## 📋 Features Implemented

✅ Email + Password login
✅ Phone + OTP login (6-digit, 60-second expiry)
✅ Resend OTP after 30 seconds
✅ Terms & Conditions acceptance
✅ Demo OTP display in toast
✅ Landing page preserved
✅ Seamless app integration
✅ User session management

## 🔧 To Enable Real Supabase Authentication

When you're ready to use real Supabase auth, follow these steps:

### 1. Enable Email/Password Auth in Supabase
- Go to Supabase Dashboard → Authentication → Providers
- Enable "Email" provider
- Enable "Password" authentication

### 2. Enable Phone/OTP Auth in Supabase
- Go to Supabase Dashboard → Authentication → Providers
- Enable "Phone" provider
- Configure Twilio credentials:
  - Get Twilio Account SID
  - Get Twilio Auth Token
  - Get Twilio phone number
  - Add to Supabase Phone settings

### 3. Create Users Table
Run this SQL in Supabase SQL Editor:

```sql
create table users (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  phone text unique,
  name text,
  created_at timestamp with time zone default now()
);
```

### 4. Update Auth Code
Replace the demo functions in `components/auth-screen.tsx`:

**For Email Login:**
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: email.trim(),
  password,
})
```

**For Phone OTP:**
```typescript
const { error } = await supabase.auth.signInWithOtp({
  phone: `+91${phone}`,
})
```

**For OTP Verification:**
```typescript
const { data, error } = await supabase.auth.verifyOtp({
  phone: `+91${phone}`,
  token: otp,
  type: "sms",
})
```

## 📁 Files Modified

- `components/auth-screen.tsx` - Main authentication component
- `lib/auth-context.tsx` - Auth context provider
- `app/page.tsx` - Home page with Supabase connection test

## 🚀 Next Steps

1. ✅ Test demo authentication (working now)
2. ⏳ Set up Supabase Email/Password auth
3. ⏳ Set up Supabase Phone/OTP auth with Twilio
4. ⏳ Replace demo functions with real Supabase calls
5. ⏳ Test with real credentials

## 📞 Support

For issues:
- Check browser console for error messages
- Verify Supabase credentials in `lib/supabaseClient.ts`
- Ensure Supabase auth providers are enabled
- Check Twilio configuration for phone OTP
