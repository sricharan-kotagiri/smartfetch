# 📊 Email Auth Visual Guide

## 🔄 COMPLETE USER FLOWS

### FLOW 1: NEW USER SIGNUP & VERIFICATION

```
┌─────────────────────────────────────────────────────────────────┐
│                    NEW USER SIGNUP FLOW                         │
└─────────────────────────────────────────────────────────────────┘

1. USER VISITS SIGNUP PAGE
   ┌──────────────────────────┐
   │  Signup Form             │
   │  - Email                 │
   │  - Password (8+ chars)   │
   │  - Confirm Password      │
   │  - Name (optional)       │
   │  - Phone (optional)      │
   └──────────────────────────┘
           ↓
2. FRONTEND VALIDATES
   ✓ Email format
   ✓ Password strength
   ✓ Passwords match
           ↓
3. BACKEND CREATES USER
   ┌──────────────────────────┐
   │ Database: users table    │
   │ - id: UUID               │
   │ - email: test@ex.com     │
   │ - password_hash: bcrypt  │
   │ - is_verified: false     │
   │ - auth_method: 'email'   │
   └──────────────────────────┘
           ↓
4. BACKEND SENDS EMAIL
   ┌──────────────────────────┐
   │ Email Service            │
   │ - Generate token         │
   │ - Store in DB            │
   │ - Send HTML email        │
   │ - Include verification   │
   │   link with token        │
   └──────────────────────────┘
           ↓
5. FRONTEND SHOWS MESSAGE
   ┌──────────────────────────┐
   │ "Check your email!"      │
   │ Verification link sent   │
   │ to test@example.com      │
   └──────────────────────────┘
           ↓
6. USER CLICKS EMAIL LINK
   https://smartfetch.com/auth/verify-email?token=abc123...
           ↓
7. FRONTEND VERIFIES TOKEN
   ┌──────────────────────────┐
   │ POST /api/auth/email/    │
   │       verify             │
   │ { token: "abc123..." }   │
   └──────────────────────────┘
           ↓
8. BACKEND VALIDATES TOKEN
   ✓ Token exists
   ✓ Not expired
   ✓ Not already used
           ↓
9. BACKEND MARKS USER VERIFIED
   ┌──────────────────────────┐
   │ Update users table       │
   │ - email_verified_at:     │
   │   NOW()                  │
   │ - is_verified: true      │
   └──────────────────────────┘
           ↓
10. DELETE USED TOKEN
    ┌──────────────────────────┐
    │ Delete from              │
    │ email_verification_      │
    │ tokens table             │
    └──────────────────────────┘
            ↓
11. FRONTEND SHOWS SUCCESS
    ┌──────────────────────────┐
    │ "Email Verified!"        │
    │ Redirecting to login...  │
    └──────────────────────────┘
            ↓
12. USER CAN NOW LOGIN ✅
```

---

### FLOW 2: EMAIL LOGIN

```
┌─────────────────────────────────────────────────────────────────┐
│                    EMAIL LOGIN FLOW                             │
└─────────────────────────────────────────────────────────────────┘

1. USER VISITS LOGIN PAGE
   ┌──────────────────────────┐
   │  Login Form              │
   │  - Email                 │
   │  - Password              │
   │  [Login Button]          │
   └──────────────────────────┘
           ↓
2. FRONTEND VALIDATES
   ✓ Email format
   ✓ Password not empty
           ↓
3. BACKEND CHECKS EMAIL
   ┌──────────────────────────┐
   │ Query users table        │
   │ WHERE email = input      │
   └──────────────────────────┘
           ↓
   ┌─────────────────────────────────────┐
   │ USER FOUND?                         │
   └─────────────────────────────────────┘
        ↙                              ↘
      YES                              NO
       ↓                                ↓
   Continue                    Error: "Invalid email
                               or password"
           ↓
4. CHECK EMAIL VERIFIED
   ┌──────────────────────────┐
   │ Is email_verified_at     │
   │ NOT NULL?                │
   └──────────────────────────┘
           ↓
   ┌─────────────────────────────────────┐
   │ EMAIL VERIFIED?                     │
   └─────────────────────────────────────┘
        ↙                              ↘
      YES                              NO
       ↓                                ↓
   Continue                    Error: "👉 Please verify
                               your email before logging in"
                               [Resend Email Button]
           ↓
5. VERIFY PASSWORD
   ┌──────────────────────────┐
   │ bcrypt.compare(          │
   │   input_password,        │
   │   stored_hash            │
   │ )                        │
   └──────────────────────────┘
           ↓
   ┌─────────────────────────────────────┐
   │ PASSWORD CORRECT?                   │
   └─────────────────────────────────────┘
        ↙                              ↘
      YES                              NO
       ↓                                ↓
   Continue                    Error: "Invalid email
                               or password"
           ↓
6. GENERATE JWT TOKEN
   ┌──────────────────────────┐
   │ jwt.sign({               │
   │   userId: user.id,       │
   │   email: user.email,     │
   │   role: user.role        │
   │ }, SECRET, {             │
   │   expiresIn: '7d'        │
   │ })                       │
   └──────────────────────────┘
           ↓
7. RETURN TOKEN & USER
   ┌──────────────────────────┐
   │ {                        │
   │   success: true,         │
   │   token: "eyJhbGc...",   │
   │   user: {                │
   │     id: "uuid",          │
   │     email: "test@ex",    │
   │     role: "customer"     │
   │   }                      │
   │ }                        │
   └──────────────────────────┘
           ↓
8. FRONTEND STORES TOKEN
   ┌──────────────────────────┐
   │ localStorage.setItem(    │
   │   'auth_token',          │
   │   token                  │
   │ )                        │
   │ localStorage.setItem(    │
   │   'user',                │
   │   JSON.stringify(user)   │
   │ )                        │
   └──────────────────────────┘
           ↓
9. REDIRECT BASED ON ROLE
   ┌─────────────────────────────────────┐
   │ role === 'shopkeeper'?              │
   └─────────────────────────────────────┘
        ↙                              ↘
      YES                              NO
       ↓                                ↓
   /dashboard                      /home
       ↓                                ↓
   Shopkeeper                      Customer
   Dashboard                       Homepage
           ↓                            ↓
        ✅ LOGGED IN                 ✅ LOGGED IN
```

---

### FLOW 3: RESEND VERIFICATION EMAIL

```
┌─────────────────────────────────────────────────────────────────┐
│              RESEND VERIFICATION EMAIL FLOW                      │
└─────────────────────────────────────────────────────────────────┘

1. USER SEES ERROR
   ┌──────────────────────────┐
   │ "👉 Please verify your   │
   │  email before logging in"│
   │ [Resend Email Button]    │
   └──────────────────────────┘
           ↓
2. USER CLICKS RESEND
   ┌──────────────────────────┐
   │ Navigate to              │
   │ /auth/resend-verification│
   └──────────────────────────┘
           ↓
3. USER ENTERS EMAIL
   ┌──────────────────────────┐
   │ Email input field        │
   │ [Resend Button]          │
   └──────────────────────────┘
           ↓
4. FRONTEND VALIDATES
   ✓ Email format
           ↓
5. BACKEND FINDS USER
   ┌──────────────────────────┐
   │ Query users table        │
   │ WHERE email = input      │
   └──────────────────────────┘
           ↓
6. DELETE OLD TOKENS
   ┌──────────────────────────┐
   │ DELETE FROM              │
   │ email_verification_      │
   │ tokens                   │
   │ WHERE user_id = user.id  │
   └──────────────────────────┘
           ↓
7. GENERATE NEW TOKEN
   ┌──────────────────────────┐
   │ crypto.randomBytes(32)   │
   │ .toString('hex')         │
   │ = new_token              │
   └──────────────────────────┘
           ↓
8. STORE NEW TOKEN
   ┌──────────────────────────┐
   │ INSERT INTO              │
   │ email_verification_      │
   │ tokens {                 │
   │   user_id,               │
   │   token,                 │
   │   expires_at: NOW+24h    │
   │ }                        │
   └──────────────────────────┘
           ↓
9. SEND NEW EMAIL
   ┌──────────────────────────┐
   │ Email with new link:     │
   │ /auth/verify-email?      │
   │ token=new_token          │
   └──────────────────────────┘
           ↓
10. SHOW SUCCESS
    ┌──────────────────────────┐
    │ "Email sent!"            │
    │ Check your inbox         │
    │ [Resend in 60s...]       │
    └──────────────────────────┘
            ↓
11. USER CLICKS NEW LINK
    (Same as Flow 1, step 6+)
            ↓
        ✅ EMAIL VERIFIED
```

---

### FLOW 4: PHONE AUTHENTICATION (UNCHANGED)

```
┌─────────────────────────────────────────────────────────────────┐
│              PHONE AUTHENTICATION FLOW                           │
│                    (STILL WORKS!)                               │
└─────────────────────────────────────────────────────────────────┘

1. USER SELECTS PHONE METHOD
   ┌──────────────────────────┐
   │ [Email] [Phone] ← Click  │
   └──────────────────────────┘
           ↓
2. USER ENTERS PHONE
   ┌──────────────────────────┐
   │ Phone: 9876543210        │
   │ [Send OTP]               │
   └──────────────────────────┘
           ↓
3. BACKEND SENDS OTP
   ┌──────────────────────────┐
   │ Twilio Verify API        │
   │ Channel: WhatsApp        │
   │ Message: Your OTP is...  │
   └──────────────────────────┘
           ↓
4. USER RECEIVES OTP
   ┌──────────────────────────┐
   │ WhatsApp Message:        │
   │ "Your OTP is 123456"     │
   └──────────────────────────┘
           ↓
5. USER ENTERS OTP
   ┌──────────────────────────┐
   │ OTP: 123456              │
   │ [Verify]                 │
   └──────────────────────────┘
           ↓
6. BACKEND VERIFIES OTP
   ┌──────────────────────────┐
   │ Twilio Verify API        │
   │ Check code               │
   └──────────────────────────┘
           ↓
7. CREATE/UPDATE USER
   ┌──────────────────────────┐
   │ If user exists:          │
   │   Update last_login      │
   │ If new user:             │
   │   Create with phone      │
   │   auth_method: 'phone'   │
   │   is_verified: true      │
   └──────────────────────────┘
           ↓
8. GENERATE JWT TOKEN
   ┌──────────────────────────┐
   │ jwt.sign({               │
   │   userId, phone, role    │
   │ })                       │
   └──────────────────────────┘
           ↓
9. REDIRECT TO DASHBOARD
   ┌──────────────────────────┐
   │ Based on role:           │
   │ - Shopkeeper → /dashboard│
   │ - Customer → /home       │
   └──────────────────────────┘
            ↓
        ✅ LOGGED IN
        (NO EMAIL VERIFICATION NEEDED)
```

---

## 📊 DATABASE SCHEMA DIAGRAM

```
┌─────────────────────────────────────────────────────────────────┐
│                         USERS TABLE                             │
├─────────────────────────────────────────────────────────────────┤
│ id (UUID) ◄─────────────────────────────────────────────────┐   │
│ email (VARCHAR, UNIQUE)                                     │   │
│ phone (VARCHAR, UNIQUE)                                     │   │
│ password_hash (VARCHAR)                                     │   │
│ full_name (VARCHAR)                                         │   │
│ role (VARCHAR) - 'customer' | 'shopkeeper'                 │   │
│ auth_method (VARCHAR) - 'email' | 'phone'                  │   │
│ is_verified (BOOLEAN)                                       │   │
│ email_verified_at (TIMESTAMP)                               │   │
│ created_at (TIMESTAMP)                                      │   │
│ updated_at (TIMESTAMP)                                      │   │
└─────────────────────────────────────────────────────────────┼───┘
                                                              │
                                                              │
┌─────────────────────────────────────────────────────────────┼───┐
│              EMAIL_VERIFICATION_TOKENS TABLE                │   │
├─────────────────────────────────────────────────────────────┼───┤
│ id (UUID)                                                   │   │
│ user_id (UUID) ──────────────────────────────────────────────┘   │
│ token (VARCHAR, UNIQUE)                                     │   │
│ expires_at (TIMESTAMP)                                      │   │
│ verified_at (TIMESTAMP)                                     │   │
│ created_at (TIMESTAMP)                                      │   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔐 SECURITY LAYERS

```
┌─────────────────────────────────────────────────────────────────┐
│                    SECURITY ARCHITECTURE                        │
└─────────────────────────────────────────────────────────────────┘

LAYER 1: PASSWORD SECURITY
┌──────────────────────────────────────────────────────────────┐
│ Input Password                                               │
│ ↓                                                            │
│ Validate Strength (8+ chars, uppercase, lowercase, etc)     │
│ ↓                                                            │
│ Bcrypt Hash (10 salt rounds)                                │
│ ↓                                                            │
│ Store in Database                                           │
│ ↓                                                            │
│ On Login: bcrypt.compare(input, stored_hash)               │
└──────────────────────────────────────────────────────────────┘

LAYER 2: EMAIL VERIFICATION
┌──────────────────────────────────────────────────────────────┐
│ Generate 64-char random token                               │
│ ↓                                                            │
│ Store with 24-hour expiry                                   │
│ ↓                                                            │
│ Send via email with verification link                       │
│ ↓                                                            │
│ User clicks link                                            │
│ ↓                                                            │
│ Validate token (exists, not expired, not used)             │
│ ↓                                                            │
│ Mark user as verified                                       │
│ ↓                                                            │
│ Delete token (single-use)                                   │
└──────────────────────────────────────────────────────────────┘

LAYER 3: LOGIN VERIFICATION
┌──────────────────────────────────────────────────────────────┐
│ Check email_verified_at IS NOT NULL                         │
│ ↓                                                            │
│ If NULL: Block login, show error                            │
│ ↓                                                            │
│ If NOT NULL: Allow login                                    │
└──────────────────────────────────────────────────────────────┘

LAYER 4: JWT TOKEN
┌──────────────────────────────────────────────────────────────┐
│ Generate JWT with userId, email, role                       │
│ ↓                                                            │
│ Sign with secret key                                        │
│ ↓                                                            │
│ Set 7-day expiry                                            │
│ ↓                                                            │
│ Store in localStorage                                       │
│ ↓                                                            │
│ Send with each API request                                  │
│ ↓                                                            │
│ Backend verifies signature and expiry                       │
└──────────────────────────────────────────────────────────────┘
```

---

## ✅ TESTING CHECKLIST

```
SIGNUP TESTS
☐ Signup with valid email and password
☐ Signup with weak password (should fail)
☐ Signup with duplicate email (should fail)
☐ Verification email is sent
☐ User created in database with is_verified=false

EMAIL VERIFICATION TESTS
☐ Click verification link works
☐ Token is validated
☐ User marked as verified (email_verified_at set)
☐ Token is deleted after use
☐ Expired token shows error
☐ Invalid token shows error

LOGIN TESTS
☐ Login with unverified email (should fail)
☐ Login with verified email (should succeed)
☐ Login with wrong password (should fail)
☐ JWT token generated
☐ User redirected based on role

RESEND TESTS
☐ Resend verification email works
☐ Old tokens deleted
☐ New token generated
☐ New email sent
☐ New link works

PHONE AUTH TESTS
☐ Phone auth still works
☐ OTP sent via WhatsApp
☐ OTP verification works
☐ User created with auth_method='phone'
☐ No email verification required

INTEGRATION TESTS
☐ Shop creation works
☐ Shops visible to customers
☐ User data in database
☐ JWT token valid for API calls
☐ Logout clears token
```

---

## 🎯 KEY METRICS

| Metric | Value |
|--------|-------|
| Password Hash Algorithm | Bcrypt (10 rounds) |
| Token Length | 64 characters (hex) |
| Token Expiry | 24 hours |
| JWT Expiry | 7 days |
| Password Min Length | 8 characters |
| Email Verification | Mandatory |
| Phone Auth | Preserved |
| Database | Supabase PostgreSQL |
| Rate Limiting | 3 OTP/minute |

---

**Status**: ✅ COMPLETE AND READY FOR PRODUCTION
