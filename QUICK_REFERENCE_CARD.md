# 🎯 SmartFetch Quick Reference Card

## Task 1: Database & Auth Setup

### 3-Step Implementation (10 minutes)

```
STEP 1: Run SQL (5 min)
├─ Go to Supabase SQL Editor
├─ Copy supabase-schema-complete.sql
├─ Paste and click Run
└─ Wait for success

STEP 2: Configure Email Auth (3 min)
├─ Go to Authentication → Providers
├─ Enable Email provider
├─ Turn on "Confirm email before login"
├─ Add redirect: http://localhost:3003/verify-success
└─ Save

STEP 3: Verify (2 min)
├─ Go to Table Editor
├─ Check all 8 tables exist
└─ Done!
```

---

## Auth Functions Cheat Sheet

### Signup
```typescript
import { signUpCustomer, signUpShopkeeper } from '@/lib/auth'

// Customer
await signUpCustomer(email, password, fullName, phone)

// Shopkeeper
await signUpShopkeeper(email, password, fullName, phone)
```

### Login
```typescript
import { login } from '@/lib/auth'

const { role, error } = await login(email, password)
// role: 'customer' | 'shopkeeper' | null
```

### Verification
```typescript
import { resendVerification } from '@/lib/auth'

await resendVerification(email)
```

### Password
```typescript
import { forgotPassword, resetPassword } from '@/lib/auth'

await forgotPassword(email)
await resetPassword(newPassword)
```

### Session
```typescript
import { logout, deleteAccount, getCurrentUser } from '@/lib/auth'

await logout()
await deleteAccount(token)
const { user } = await getCurrentUser()
```

---

## Database Tables

| Table | Purpose |
|-------|---------|
| customers | Customer profiles |
| shopkeepers | Shopkeeper profiles |
| shops | Shop info |
| products | Shop products |
| orders | Customer orders |
| order_items | Items in orders |
| cart_items | Shopping cart |
| order_messages | Chat messages |

---

## Environment Variables

### Frontend
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Backend
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PORT=5000
FRONTEND_URL=http://localhost:3003
```

---

## Documentation Files

| File | Purpose | Time |
|------|---------|------|
| TASK_1_START_HERE.md | Quick start | 5 min |
| SUPABASE_SQL_COPY_PASTE.md | Copy SQL | 2 min |
| DATABASE_AND_AUTH_SETUP.md | Detailed guide | 15 min |
| TASK_1_CHECKLIST.md | Verification | 10 min |
| TASK_1_COMPLETE_SUMMARY.md | Reference | 20 min |
| TASK_1_VISUAL_GUIDE.md | Diagrams | 10 min |
| TASK_1_DELIVERY.md | Summary | 5 min |
| TASK_1_INDEX.md | Navigation | 5 min |

---

## RLS Policies

### Public Access
- Anyone can read active shops
- Anyone can read available products

### Customer Access
- Read/update/delete own profile
- Read/update/delete own orders
- Read/update/delete own cart

### Shopkeeper Access
- Read/update/delete own profile
- Read/update own shop
- Read/update/delete own products
- Read/update orders for their shop

### Messaging
- Read messages you're involved in
- Create messages for orders you're involved in

---

## Auth Flow

### Customer Signup
```
User enters email/password/name/phone
         ↓
signUpCustomer() creates auth user
         ↓
Customer record inserted
         ↓
Verification email sent
         ↓
Redirect to /verify-notice
         ↓
User clicks email link
         ↓
Redirect to /verify-success
         ↓
User can login
```

### Login
```
User enters email/password
         ↓
login() authenticates
         ↓
Check email verified
         ↓
Detect role
         ↓
Redirect to /home or /dashboard
```

---

## Status

✅ Database schema created
✅ RLS policies applied
✅ Email auth configured
✅ Auth library ready
✅ Documentation complete

**Ready for Task 2** 🚀

---

## Next Steps

1. ✅ Task 1: Database & Auth (COMPLETE)
2. ⏭️ Task 2: Frontend Pages
3. ⏭️ Task 3: Customer Pages
4. ⏭️ Task 4: Shopkeeper Pages
5. ⏭️ Task 5: Backend API

---

## Quick Links

- 📚 [Supabase Docs](https://supabase.com/docs)
- 🔐 [Auth Guide](https://supabase.com/docs/guides/auth)
- 🛡️ [RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

**Print this card for quick reference!** 📋
