# 🚀 Email Auth Quick Start Guide

## ⚡ 5-MINUTE SETUP

### Step 1: Database Setup
```bash
# Run this SQL in Supabase SQL Editor
# File: supabase-complete-schema.sql
```

### Step 2: Environment Variables
Add to `backend/.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@smartfetch.com
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-key
JWT_SECRET=your-secret
FRONTEND_URL=http://localhost:3000
```

### Step 3: Start Backend
```bash
cd backend
npm install
npm run dev
```

### Step 4: Start Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 TESTING FLOWS

### Test 1: Email Signup
1. Go to signup page
2. Enter: email, password (with requirements), name
3. Click "Sign Up"
4. **Expected**: "Check your email" message
5. Check email inbox for verification link
6. Click link
7. **Expected**: "Email verified!" message
8. Redirected to login

### Test 2: Email Login (Verified)
1. Go to login page
2. Enter verified email and password
3. Click "Login"
4. **Expected**: Redirected to dashboard/home

### Test 3: Email Login (Unverified)
1. Go to login page
2. Enter unverified email and password
3. Click "Login"
4. **Expected**: Error "Please verify your email before logging in"
5. Click "Resend Verification Email"
6. Enter email
7. **Expected**: New verification email sent

### Test 4: Phone Auth (Still Works)
1. Go to login page
2. Switch to "Phone" tab
3. Enter phone number
4. Click "Send OTP"
5. **Expected**: OTP sent via WhatsApp
6. Enter OTP
7. Click "Verify"
8. **Expected**: Logged in successfully

### Test 5: Shop Creation
1. Login as shopkeeper
2. Create a shop
3. Go to customer view
4. **Expected**: Shop visible in list

---

## 📧 EMAIL TESTING

### Using Gmail
1. Enable 2-factor authentication
2. Generate app password
3. Use app password in SMTP_PASS

### Using Mailtrap (Recommended for Testing)
1. Sign up at mailtrap.io
2. Get SMTP credentials
3. Add to .env:
```env
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your-mailtrap-user
SMTP_PASS=your-mailtrap-pass
```

### Using Ethereal (Free Testing)
```bash
# Generate test email account
npm install -g nodemailer
node -e "require('nodemailer').createTestAccount((err, testAccount) => console.log(testAccount))"
```

---

## 🔍 DEBUGGING

### Check Backend Logs
```bash
# Look for email sending logs
# Should see: "Verification email sent to user@example.com"
```

### Check Database
```sql
-- Check users table
SELECT id, email, email_verified_at FROM users;

-- Check verification tokens
SELECT user_id, token, expires_at FROM email_verification_tokens;
```

### Check Frontend Console
```javascript
// Check if token is stored
localStorage.getItem('auth_token')

// Check user data
JSON.parse(localStorage.getItem('user'))
```

---

## ✅ VERIFICATION CHECKLIST

- [ ] Signup creates user in database
- [ ] Verification email is sent
- [ ] Email link works and verifies user
- [ ] Login blocked for unverified email
- [ ] Login works for verified email
- [ ] Resend email works
- [ ] Phone auth still works
- [ ] Shop creation visible to customers
- [ ] JWT token generated on login
- [ ] User redirected based on role

---

## 🆘 COMMON ISSUES

### Email Not Sending
- Check SMTP credentials
- Check email service logs
- Verify FRONTEND_URL is correct
- Check spam folder

### Token Expired
- Tokens expire after 24 hours
- User can resend verification email
- New token is generated

### Login Still Blocked
- Check `email_verified_at` in database
- Verify token was marked as verified
- Check browser console for errors

### Phone Auth Not Working
- Verify Twilio credentials
- Check WhatsApp number is correct
- Check rate limiting (3 per minute)

---

## 📱 TESTING ACCOUNTS

### Email Test Account
```
Email: test@example.com
Password: Test@1234
```

### Phone Test Account
```
Phone: 9876543210
(Will receive OTP via WhatsApp)
```

---

## 🎯 NEXT STEPS

1. ✅ Test all flows
2. ✅ Verify database data
3. ✅ Check email delivery
4. ✅ Test error scenarios
5. ✅ Deploy to production
6. ✅ Monitor logs

---

## 📞 SUPPORT

If something doesn't work:
1. Check error logs
2. Verify environment variables
3. Test email service separately
4. Check Supabase dashboard
5. Review browser console

**Everything should work out of the box!** 🎉
