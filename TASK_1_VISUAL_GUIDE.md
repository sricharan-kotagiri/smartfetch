# 📊 TASK 1: Visual Setup Guide

## Database Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    SMARTFETCH DATABASE                      │
└─────────────────────────────────────────────────────────────┘

┌──────────────────┐         ┌──────────────────┐
│   CUSTOMERS      │         │   SHOPKEEPERS    │
├──────────────────┤         ├──────────────────┤
│ id (PK)          │         │ id (PK)          │
│ full_name        │         │ full_name        │
│ email (UNIQUE)   │         │ email (UNIQUE)   │
│ phone            │         │ phone (REQ)      │
│ avatar_url       │         │ upi_id           │
│ role: customer   │         │ role: shopkeeper │
│ created_at       │         │ created_at       │
└──────────────────┘         └──────────────────┘
         │                            │
         │                            │
         │                    ┌───────▼────────┐
         │                    │     SHOPS      │
         │                    ├────────────────┤
         │                    │ id (PK)        │
         │                    │ shopkeeper_id  │
         │                    │ name           │
         │                    │ category       │
         │                    │ address        │
         │                    │ city           │
         │                    │ lat/lng        │
         │                    │ image_url      │
         │                    │ opening_time   │
         │                    │ closing_time   │
         │                    │ is_active      │
         │                    │ created_at     │
         │                    └────────┬────────┘
         │                             │
         │                    ┌────────▼────────┐
         │                    │   PRODUCTS     │
         │                    ├────────────────┤
         │                    │ id (PK)        │
         │                    │ shop_id (FK)   │
         │                    │ name           │
         │                    │ price          │
         │                    │ image_url      │
         │                    │ stock_qty      │
         │                    │ is_available   │
         │                    │ created_at     │
         │                    └────────────────┘
         │
         │
    ┌────▼──────────┐
    │    ORDERS     │
    ├───────────────┤
    │ id (PK)       │
    │ customer_id   │
    │ shop_id       │
    │ status        │
    │ total_amount  │
    │ payment_meth  │
    │ pickup_code   │
    │ pickup_time   │
    │ created_at    │
    │ updated_at    │
    └────┬──────────┘
         │
    ┌────┴──────────────┐
    │                   │
┌───▼──────────┐  ┌────▼──────────┐
│ ORDER_ITEMS  │  │ ORDER_MESSAGES │
├──────────────┤  ├────────────────┤
│ id (PK)      │  │ id (PK)        │
│ order_id     │  │ order_id       │
│ product_id   │  │ sender_id      │
│ quantity     │  │ sender_role    │
│ unit_price   │  │ message        │
│ subtotal     │  │ is_read        │
└──────────────┘  │ created_at     │
                  └────────────────┘

┌──────────────────┐
│   CART_ITEMS     │
├──────────────────┤
│ id (PK)          │
│ customer_id      │
│ product_id       │
│ quantity         │
│ created_at       │
└──────────────────┘
```

---

## Auth Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                      │
└─────────────────────────────────────────────────────────────┘

CUSTOMER SIGNUP:
┌──────────────┐
│ User enters: │
│ - Email      │
│ - Password   │
│ - Full Name  │
│ - Phone      │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────┐
│ signUpCustomer()             │
│ - Create auth user           │
│ - Insert customers row       │
│ - Send verification email    │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Redirect to /verify-notice   │
│ Show: "Check your inbox"     │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ User clicks email link       │
│ Redirected to /verify-success│
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Email verified!              │
│ Redirect to /login           │
└──────────────────────────────┘


LOGIN:
┌──────────────┐
│ User enters: │
│ - Email      │
│ - Password   │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────┐
│ login()                      │
│ - Authenticate with Supabase │
│ - Check email verified       │
│ - Detect role               │
└──────┬───────────────────────┘
       │
       ├─ role = 'customer'
       │  └─ Redirect to /home
       │
       └─ role = 'shopkeeper'
          └─ Redirect to /dashboard


FORGOT PASSWORD:
┌──────────────┐
│ User enters: │
│ - Email      │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────┐
│ forgotPassword()             │
│ - Send reset email           │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ User clicks email link       │
│ Redirected to /reset-password│
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ User enters new password     │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ resetPassword()              │
│ - Update password            │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Redirect to /login           │
│ Show: "Password updated!"    │
└──────────────────────────────┘


DELETE ACCOUNT:
┌──────────────────────────────┐
│ User clicks "Delete Account" │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Show confirmation modal      │
│ "This cannot be undone"      │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ deleteAccount()              │
│ - Delete all user data       │
│ - Delete auth user           │
│ - Sign out                   │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Redirect to /                │
│ Show: "Account deleted"      │
└──────────────────────────────┘
```

---

## RLS Policy Matrix

```
┌─────────────────────────────────────────────────────────────┐
│              ROW LEVEL SECURITY POLICIES                    │
└─────────────────────────────────────────────────────────────┘

TABLE: SHOPS
┌──────────────────────────────────────────────────────────┐
│ Policy                    │ Who Can Access              │
├──────────────────────────────────────────────────────────┤
│ Public read active shops  │ Anyone (SELECT only)        │
│ Shopkeeper manage own     │ Shop owner (ALL operations) │
└──────────────────────────────────────────────────────────┘

TABLE: PRODUCTS
┌──────────────────────────────────────────────────────────┐
│ Policy                    │ Who Can Access              │
├──────────────────────────────────────────────────────────┤
│ Public read available     │ Anyone (SELECT only)        │
│ Shopkeeper manage own     │ Shop owner (ALL operations) │
└──────────────────────────────────────────────────────────┘

TABLE: CUSTOMERS
┌──────────────────────────────────────────────────────────┐
│ Policy                    │ Who Can Access              │
├──────────────────────────────────────────────────────────┤
│ Read own data             │ Customer (SELECT only)      │
│ Update own data           │ Customer (UPDATE only)      │
│ Delete own data           │ Customer (DELETE only)      │
└──────────────────────────────────────────────────────────┘

TABLE: SHOPKEEPERS
┌──────────────────────────────────────────────────────────┐
│ Policy                    │ Who Can Access              │
├──────────────────────────────────────────────────────────┤
│ Read own data             │ Shopkeeper (SELECT only)    │
│ Update own data           │ Shopkeeper (UPDATE only)    │
│ Delete own data           │ Shopkeeper (DELETE only)    │
└──────────────────────────────────────────────────────────┘

TABLE: ORDERS
┌──────────────────────────────────────────────────────────┐
│ Policy                    │ Who Can Access              │
├──────────────────────────────────────────────────────────┤
│ Customers own orders      │ Customer (ALL operations)   │
│ Shopkeeper read orders    │ Shop owner (SELECT only)    │
│ Shopkeeper update orders  │ Shop owner (UPDATE only)    │
└──────────────────────────────────────────────────────────┘

TABLE: CART_ITEMS
┌──────────────────────────────────────────────────────────┐
│ Policy                    │ Who Can Access              │
├──────────────────────────────────────────────────────────┤
│ Customers own cart        │ Customer (ALL operations)   │
└──────────────────────────────────────────────────────────┘

TABLE: ORDER_MESSAGES
┌──────────────────────────────────────────────────────────┐
│ Policy                    │ Who Can Access              │
├──────────────────────────────────────────────────────────┤
│ Users read own messages   │ Involved parties (SELECT)   │
│ Users create messages     │ Involved parties (INSERT)   │
└──────────────────────────────────────────────────────────┘
```

---

## Setup Checklist Timeline

```
┌─────────────────────────────────────────────────────────────┐
│                    SETUP TIMELINE                           │
└─────────────────────────────────────────────────────────────┘

⏱️  0-2 min: Copy SQL schema
    └─ Open supabase-schema-complete.sql
    └─ Copy entire contents

⏱️  2-5 min: Run SQL in Supabase
    └─ Go to SQL Editor
    └─ Paste SQL
    └─ Click Run
    └─ Wait for success

⏱️  5-8 min: Configure Email Auth
    └─ Go to Authentication → Providers
    └─ Enable Email provider
    └─ Turn on "Confirm email before login"
    └─ Add redirect URL
    └─ Save

⏱️  8-10 min: Verify Setup
    └─ Go to Table Editor
    └─ Check all 8 tables exist
    └─ Verify RLS policies applied

✅ COMPLETE: Database & Auth Ready!
```

---

## File Structure After Task 1

```
smartfetch/
├── frontend/
│   ├── src/
│   │   ├── lib/
│   │   │   └── auth.ts ✅ NEW - Auth library
│   │   ├── config/
│   │   │   └── supabase.ts
│   │   ├── services/
│   │   ├── pages/
│   │   └── components/
│   ├── .env ✅ Updated with Supabase credentials
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── services/
│   ├── .env ✅ Updated with Supabase credentials
│   └── package.json
│
├── supabase-schema-complete.sql ✅ NEW - Database schema
├── DATABASE_AND_AUTH_SETUP.md ✅ NEW - Setup guide
├── SUPABASE_SQL_COPY_PASTE.md ✅ NEW - Copy-paste SQL
├── TASK_1_CHECKLIST.md ✅ NEW - Verification checklist
├── TASK_1_COMPLETE_SUMMARY.md ✅ NEW - Summary
└── TASK_1_VISUAL_GUIDE.md ✅ NEW - This file
```

---

## Quick Reference: Auth Functions

```typescript
// SIGNUP
import { signUpCustomer, signUpShopkeeper } from '@/lib/auth'

await signUpCustomer(email, password, fullName, phone)
await signUpShopkeeper(email, password, fullName, phone)

// LOGIN
import { login } from '@/lib/auth'

const { role, error } = await login(email, password)

// VERIFICATION
import { resendVerification } from '@/lib/auth'

await resendVerification(email)

// PASSWORD
import { forgotPassword, resetPassword } from '@/lib/auth'

await forgotPassword(email)
await resetPassword(newPassword)

// SESSION
import { logout, deleteAccount } from '@/lib/auth'

await logout()
await deleteAccount(token)

// USER INFO
import { getCurrentUser, getUserRole } from '@/lib/auth'

const { user } = await getCurrentUser()
const { role } = await getUserRole(userId)
```

---

## Supabase Dashboard Navigation

```
Supabase Dashboard
├── Project Settings
│   └── API Keys (copy ANON_KEY and SERVICE_ROLE_KEY)
│
├── Authentication
│   ├── Providers
│   │   └── Email ✅ Enable & Configure
│   ├── Users
│   │   └── View all auth users
│   └── Email Templates
│       └── Customize verification email
│
├── SQL Editor
│   └── Run schema SQL ✅
│
└── Table Editor
    ├── customers ✅
    ├── shopkeepers ✅
    ├── shops ✅
    ├── products ✅
    ├── orders ✅
    ├── order_items ✅
    ├── cart_items ✅
    └── order_messages ✅
```

---

## Status Summary

```
┌─────────────────────────────────────────────────────────────┐
│                    TASK 1 STATUS                            │
└─────────────────────────────────────────────────────────────┘

✅ Database Schema Created
   └─ 8 tables with proper relationships
   └─ Foreign keys configured
   └─ Indexes for performance

✅ Row Level Security Enabled
   └─ 16 policies for data access
   └─ Public read for shops/products
   └─ Private read for user data

✅ Email Authentication Configured
   └─ Email provider enabled
   └─ Email verification required
   └─ Redirect URL set

✅ Auth Library Created
   └─ 13 functions ready to use
   └─ Error handling included
   └─ TypeScript types defined

✅ Documentation Complete
   └─ Setup guide
   └─ Copy-paste SQL
   └─ Checklists
   └─ Visual guides

⏭️  NEXT: Build Frontend Pages (Task 2)
```

---

**Time to Complete Task 1: ~10 minutes**

**Status: ✅ READY TO BUILD**

🚀 Let's go!
