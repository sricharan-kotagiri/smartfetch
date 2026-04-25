# SmartFetch Database & Authentication Setup Guide

## Overview
This guide walks you through setting up the complete database schema and email authentication for SmartFetch.

---

## PART 1: Database Setup in Supabase

### Step 1: Access Supabase SQL Editor
1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Run the Complete Schema
1. Copy the entire contents of `supabase-schema-complete.sql`
2. Paste it into the SQL Editor
3. Click **Run** button
4. Wait for all queries to complete successfully

**What gets created:**
- ✅ 8 tables: customers, shopkeepers, shops, products, orders, order_items, cart_items, order_messages
- ✅ Row Level Security (RLS) enabled on all tables
- ✅ 13 RLS policies for data access control
- ✅ Performance indexes on foreign keys and frequently queried columns
- ✅ Trigger for automatic `updated_at` timestamp on orders

### Step 3: Verify Tables Created
1. Go to **Table Editor** in Supabase
2. You should see all 8 tables listed:
   - customers
   - shopkeepers
   - shops
   - products
   - orders
   - order_items
   - cart_items
   - order_messages

---

## PART 2: Email Authentication Configuration

### Step 1: Enable Email Provider
1. Go to **Authentication** → **Providers** in Supabase Dashboard
2. Find **Email** provider
3. Click to expand it
4. Toggle **Enabled** to ON
5. Ensure **Confirm email before login** is toggled ON
6. Click **Save**

### Step 2: Configure Redirect URL
1. Still in **Authentication** → **Providers** → **Email**
2. Scroll down to **Redirect URLs**
3. Add this URL: `http://localhost:3003/verify-success`
4. Click **Save**

### Step 3: Email Templates (Optional but Recommended)
1. Go to **Authentication** → **Email Templates**
2. Customize the verification email template if desired
3. Default template is fine for development

---

## PART 3: Frontend Setup

### Step 1: Verify Environment Variables
Check `frontend/.env` has these variables:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Step 2: Auth Library Already Created
The file `frontend/src/lib/auth.ts` has been created with all auth functions:

**Available Functions:**
- `signUpCustomer(email, password, full_name, phone?)` - Customer registration
- `signUpShopkeeper(email, password, full_name, phone)` - Shopkeeper registration
- `login(email, password)` - Login with role detection
- `resendVerification(email)` - Resend verification email
- `forgotPassword(email)` - Send password reset email
- `resetPassword(newPassword)` - Update password
- `logout()` - Clear session (account stays)
- `deleteAccount(token)` - Permanent deletion
- `getCurrentUser()` - Get current authenticated user
- `getCurrentSession()` - Get current session
- `getUserRole(userId)` - Get user's role
- `isEmailVerified(userId)` - Check if email verified
- `onAuthStateChange(callback)` - Listen to auth changes

### Step 3: Import Auth Functions in Components
```typescript
import {
  signUpCustomer,
  signUpShopkeeper,
  login,
  logout,
  resendVerification,
  forgotPassword,
  resetPassword,
  deleteAccount
} from '@/lib/auth'
```

---

## PART 4: Backend Setup

### Step 1: Verify Environment Variables
Check `backend/.env` has these variables:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
PORT=5000
FRONTEND_URL=http://localhost:3003
```

### Step 2: Backend Auth Middleware
The backend needs to verify Supabase JWT tokens. Create `backend/src/middleware/auth.middleware.ts`:

```typescript
import { Request, Response, NextFunction } from 'express'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const { data, error } = await supabase.auth.getUser(token)
    
    if (error || !data.user) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    req.user = data.user
    next()
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' })
  }
}
```

### Step 3: Delete Account Endpoint
Create `backend/src/routes/auth.routes.ts` with delete endpoint:

```typescript
import { Router, Request, Response } from 'express'
import { createClient } from '@supabase/supabase-js'
import { authMiddleware } from '../middleware/auth.middleware'

const router = Router()

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// DELETE ACCOUNT - Permanent deletion
router.delete('/auth/delete-account', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id

    // Delete from order_messages
    await supabase.from('order_messages').delete().eq('sender_id', userId)

    // Delete from cart_items
    await supabase.from('cart_items').delete().eq('customer_id', userId)

    // Delete from customers or shopkeepers
    await supabase.from('customers').delete().eq('id', userId)
    await supabase.from('shopkeepers').delete().eq('id', userId)

    // Delete auth user using service role
    await supabase.auth.admin.deleteUser(userId)

    res.json({ message: 'Account permanently deleted' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete account' })
  }
})

export default router
```

---

## PART 5: Testing the Setup

### Test 1: Customer Signup
```bash
curl -X POST http://localhost:5000/api/auth/register-customer \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "password": "SecurePass123!",
    "full_name": "John Doe",
    "phone": "9876543210"
  }'
```

### Test 2: Shopkeeper Signup
```bash
curl -X POST http://localhost:5000/api/auth/register-shopkeeper \
  -H "Content-Type: application/json" \
  -d '{
    "email": "shopkeeper@example.com",
    "password": "SecurePass123!",
    "full_name": "Shop Owner",
    "phone": "9876543210"
  }'
```

### Test 3: Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "password": "SecurePass123!"
  }'
```

### Test 4: Check Supabase Tables
1. Go to Supabase **Table Editor**
2. Click on **customers** table
3. You should see the newly created customer record
4. Click on **shopkeepers** table
5. You should see the newly created shopkeeper record

---

## PART 6: Troubleshooting

### Issue: "Missing Supabase credentials"
**Solution:** Check that `frontend/.env` and `backend/.env` have correct values

### Issue: "Email verification not working"
**Solution:** 
1. Check Supabase **Authentication** → **Providers** → **Email**
2. Ensure "Confirm email before login" is ON
3. Check redirect URL is set to `http://localhost:3003/verify-success`

### Issue: "RLS policies blocking access"
**Solution:**
1. Go to Supabase **Authentication** → **Policies**
2. Verify all policies are created
3. Check that policies match the user's role

### Issue: "Cannot delete account"
**Solution:**
1. Ensure `SUPABASE_SERVICE_ROLE_KEY` is set in backend `.env`
2. Service role key must have admin permissions
3. Check backend auth middleware is working

---

## PART 7: Next Steps

After completing this setup:

1. ✅ Create frontend pages:
   - Landing page (`/`)
   - Signup page (`/signup`)
   - Login page (`/login`)
   - Verify notice page (`/verify-notice`)
   - Verify success page (`/verify-success`)
   - Forgot password page (`/forgot-password`)
   - Reset password page (`/reset-password`)

2. ✅ Create customer pages:
   - Home page (`/home`)
   - Shop detail page (`/shop/:id`)
   - Cart page (`/cart`)
   - Checkout page (`/checkout`)
   - Orders page (`/orders`)
   - Order detail page (`/order/:id`)
   - Profile page (`/profile`)

3. ✅ Create shopkeeper pages:
   - Dashboard (`/dashboard`)
   - Shop setup (`/dashboard/shop`)
   - Products management (`/dashboard/products`)
   - Orders management (`/dashboard/orders`)
   - QR scanner (`/dashboard/scanner`)
   - Analytics (`/dashboard/analytics`)

4. ✅ Implement backend API endpoints for all operations

---

## Database Schema Summary

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| **customers** | Customer profiles | id, full_name, email, phone, role |
| **shopkeepers** | Shopkeeper profiles | id, full_name, email, phone, upi_id, role |
| **shops** | Shop information | id, shopkeeper_id, name, category, address, city, lat/lng, hours |
| **products** | Shop products | id, shop_id, name, price, stock_quantity, is_available |
| **orders** | Customer orders | id, customer_id, shop_id, status, total_amount, pickup_code, pickup_time |
| **order_items** | Items in each order | id, order_id, product_id, quantity, unit_price, subtotal |
| **cart_items** | Customer shopping cart | id, customer_id, product_id, quantity |
| **order_messages** | Real-time chat | id, order_id, sender_id, sender_role, message, is_read |

---

## Auth Flow Summary

### Customer Signup Flow
1. User enters email, password, name, phone
2. `signUpCustomer()` creates auth user in Supabase
3. Verification email sent automatically
4. Customer record inserted into `customers` table
5. User redirected to `/verify-notice`
6. User clicks email link → redirected to `/verify-success`
7. User can now login

### Shopkeeper Signup Flow
1. User enters email, password, name, phone
2. `signUpShopkeeper()` creates auth user in Supabase
3. Verification email sent automatically
4. Shopkeeper record inserted into `shopkeepers` table
5. User redirected to `/verify-notice`
6. User clicks email link → redirected to `/verify-success`
7. User can now login

### Login Flow
1. User enters email and password
2. `login()` authenticates with Supabase
3. Checks if email is verified
4. Checks `customers` table for role
5. If not found, checks `shopkeepers` table
6. Returns role: 'customer' or 'shopkeeper'
7. Frontend redirects to `/home` or `/dashboard`

---

## Security Notes

- ✅ All passwords hashed by Supabase
- ✅ Email verification required before login
- ✅ RLS policies enforce data isolation
- ✅ Service role key only used for admin operations (delete account)
- ✅ JWT tokens expire automatically
- ✅ CORS configured for frontend URL only

---

**Setup Complete!** You're ready to build the frontend and backend pages. 🚀
