# SmartFetch Authentication Fix - Testing & Verification Guide

## Overview

This guide provides comprehensive testing procedures to verify that the authentication system is working correctly after the fixes.

---

## PRE-TESTING CHECKLIST

Before testing, ensure:

- [ ] All three files have been updated:
  - `frontend/src/lib/auth.ts`
  - `frontend/src/components/AuthGuard.tsx`
  - `frontend/src/pages/login.tsx`

- [ ] Frontend builds without errors:
  ```bash
  cd frontend
  npm run build
  ```

- [ ] No TypeScript errors in the console

- [ ] Browser DevTools is open (F12)

---

## TEST 1: Shopkeeper Signup and Login

### Setup
1. Open browser DevTools (F12)
2. Go to Console tab
3. Clear localStorage:
   ```javascript
   localStorage.clear()
   ```

### Steps
1. Navigate to `/signup?role=shopkeeper`
2. Fill in shopkeeper details:
   - Full Name: `Test Shopkeeper`
   - Email: `shopkeeper@test.com`
   - Password: `TestPass123!`
   - Phone: `9876543210`
   - Shop Name: `Test Shop`
   - Category: Select any category
   - UPI ID: `test@upi`
   - Location: `Test Location`
3. Accept terms and click Sign Up
4. Verify email (check inbox or use test email)
5. Navigate to `/login`
6. Login with:
   - Email: `shopkeeper@test.com`
   - Password: `TestPass123!`

### Expected Results

**Console Logs** (should see):
```
🔐 [LOGIN] Starting login process...
📧 [LOGIN] Email: shopkeeper@test.com
✅ [LOGIN] Auth successful for user: [user-id]
👤 [LOGIN] User metadata: {role: 'shopkeeper', ...}
🎭 [LOGIN] Role from metadata: shopkeeper
💾 [LOGIN] Stored role in localStorage: shopkeeper
🔀 [LOGIN] Redirecting to /dashboard (shopkeeper)
```

**Browser Behavior**:
- [ ] Redirected to `/dashboard` (shopkeeper dashboard)
- [ ] No redirect loop
- [ ] Page loads successfully

**localStorage** (check in DevTools):
- [ ] `sf_user_role` = `'shopkeeper'`
- [ ] `sf_user_id` = user ID

**Result**: ✅ PASS or ❌ FAIL

---

## TEST 2: Customer Signup and Login

### Setup
1. Open browser DevTools (F12)
2. Go to Console tab
3. Clear localStorage:
   ```javascript
   localStorage.clear()
   ```

### Steps
1. Navigate to `/signup` (or `/signup?role=customer`)
2. Fill in customer details:
   - Full Name: `Test Customer`
   - Email: `customer@test.com`
   - Password: `TestPass123!`
3. Accept terms and click Sign Up
4. Verify email (check inbox or use test email)
5. Navigate to `/login`
6. Login with:
   - Email: `customer@test.com`
   - Password: `TestPass123!`

### Expected Results

**Console Logs** (should see):
```
🔐 [LOGIN] Starting login process...
📧 [LOGIN] Email: customer@test.com
✅ [LOGIN] Auth successful for user: [user-id]
👤 [LOGIN] User metadata: {role: 'customer', ...}
🎭 [LOGIN] Role from metadata: customer
💾 [LOGIN] Stored role in localStorage: customer
🔀 [LOGIN] Redirecting to /home (customer)
```

**Browser Behavior**:
- [ ] Redirected to `/home` (customer home)
- [ ] No redirect loop
- [ ] Page loads successfully

**localStorage** (check in DevTools):
- [ ] `sf_user_role` = `'customer'`
- [ ] `sf_user_id` = user ID

**Result**: ✅ PASS or ❌ FAIL

---

## TEST 3: Wrong Role Access (Shopkeeper tries to access /home)

### Setup
1. Login as shopkeeper (from TEST 1)
2. Verify you're on `/dashboard`

### Steps
1. Manually navigate to `/home` in the URL bar
2. Press Enter

### Expected Results

**Console Logs** (should see):
```
🔐 [AUTHGUARD] Checking access for role: customer
✅ [AUTHGUARD] Session found for user: [user-id]
💾 [AUTHGUARD] Cached role from localStorage: shopkeeper
⚠️ [AUTHGUARD] Role mismatch! User has: shopkeeper but needs: customer
🔀 [AUTHGUARD] Redirecting to correct dashboard: /dashboard
🔀 [AUTHGUARD] Redirecting to: /dashboard
```

**Browser Behavior**:
- [ ] Redirected back to `/dashboard`
- [ ] No error messages
- [ ] Page loads successfully

**Result**: ✅ PASS or ❌ FAIL

---

## TEST 4: Wrong Role Access (Customer tries to access /dashboard)

### Setup
1. Login as customer (from TEST 2)
2. Verify you're on `/home`

### Steps
1. Manually navigate to `/dashboard` in the URL bar
2. Press Enter

### Expected Results

**Console Logs** (should see):
```
🔐 [AUTHGUARD] Checking access for role: shopkeeper
✅ [AUTHGUARD] Session found for user: [user-id]
💾 [AUTHGUARD] Cached role from localStorage: customer
⚠️ [AUTHGUARD] Role mismatch! User has: customer but needs: shopkeeper
🔀 [AUTHGUARD] Redirecting to correct dashboard: /home
🔀 [AUTHGUARD] Redirecting to: /home
```

**Browser Behavior**:
- [ ] Redirected back to `/home`
- [ ] No error messages
- [ ] Page loads successfully

**Result**: ✅ PASS or ❌ FAIL

---

## TEST 5: Logout and Re-login

### Setup
1. Login as shopkeeper (from TEST 1)
2. Verify you're on `/dashboard`

### Steps
1. Click Logout button
2. Verify you're redirected to `/login`
3. Check localStorage
4. Login again with shopkeeper credentials

### Expected Results

**After Logout**:
- [ ] Redirected to `/login`
- [ ] localStorage cleared:
  - `sf_user_role` should be removed
  - `sf_user_id` should be removed

**Console Logs** (should see):
```
🧹 [AUTH] Clearing auth cache
✅ [AUTH] Auth cache cleared
🚪 [AUTH] Logging out user
✅ [AUTH] User logged out
```

**After Re-login**:
- [ ] Redirected to `/dashboard` again
- [ ] localStorage populated again
- [ ] No errors

**Result**: ✅ PASS or ❌ FAIL

---

## TEST 6: Page Refresh with Cached Role

### Setup
1. Login as shopkeeper (from TEST 1)
2. Verify you're on `/dashboard`

### Steps
1. Press F5 to refresh the page
2. Wait for page to load

### Expected Results

**Console Logs** (should see):
```
🔐 [AUTHGUARD] Checking access for role: shopkeeper
✅ [AUTHGUARD] Session found for user: [user-id]
💾 [AUTHGUARD] Cached role from localStorage: shopkeeper
✅ [AUTHGUARD] Role matches! Allowing access
```

**Browser Behavior**:
- [ ] Page loads without redirect
- [ ] Still on `/dashboard`
- [ ] No loading spinner (or very brief)

**Performance**:
- [ ] Page loads faster than initial login (cached role)

**Result**: ✅ PASS or ❌ FAIL

---

## TEST 7: Multiple Tabs Consistency

### Setup
1. Login as shopkeeper in Tab 1
2. Verify you're on `/dashboard`

### Steps
1. Open a new tab (Tab 2)
2. Navigate to `/home` in Tab 2
3. Check if redirected to `/dashboard`

### Expected Results

**Tab 2 Behavior**:
- [ ] Redirected to `/dashboard` (correct role)
- [ ] Role is consistent across tabs

**localStorage**:
- [ ] Same role in both tabs

**Result**: ✅ PASS or ❌ FAIL

---

## TEST 8: Invalid Credentials

### Setup
1. Navigate to `/login`

### Steps
1. Enter invalid email: `invalid@test.com`
2. Enter any password
3. Click Login

### Expected Results

**Error Message**:
- [ ] Shows "Wrong email or password. Please try again."

**Console Logs**:
- [ ] Shows auth error

**Browser Behavior**:
- [ ] Stays on `/login` page
- [ ] No redirect

**Result**: ✅ PASS or ❌ FAIL

---

## TEST 9: Unverified Email

### Setup
1. Create a new account but don't verify email
2. Try to login

### Steps
1. Navigate to `/login`
2. Enter email and password of unverified account
3. Click Login

### Expected Results

**Error Message**:
- [ ] Shows "Please verify your email first. Check your inbox."

**Browser Behavior**:
- [ ] Stays on `/login` page
- [ ] No redirect

**Result**: ✅ PASS or ❌ FAIL

---

## TEST 10: No Session (Logged Out)

### Setup
1. Logout completely
2. Clear localStorage

### Steps
1. Try to access `/dashboard` directly
2. Try to access `/home` directly

### Expected Results

**For `/dashboard`**:
- [ ] Redirected to `/login`

**For `/home`**:
- [ ] Redirected to `/login`

**Console Logs**:
- [ ] Shows "No session found"

**Result**: ✅ PASS or ❌ FAIL

---

## DEBUGGING CHECKLIST

If any test fails, check:

### Console Logs
- [ ] Are logs showing the correct flow?
- [ ] Are there any error messages?
- [ ] Is the role being detected correctly?

### localStorage
- [ ] Is `sf_user_role` set correctly?
- [ ] Is `sf_user_id` set correctly?
- [ ] Is cache cleared on logout?

### Database
- [ ] Is user in `shopkeepers` table?
- [ ] Is user in `customers` table?
- [ ] Is role stored in user_metadata?

### Network
- [ ] Is login API returning correct role?
- [ ] Is auth request successful?
- [ ] Are there any CORS errors?

---

## COMMON ISSUES AND SOLUTIONS

### Issue: Shopkeeper redirects to `/home`

**Possible Causes**:
1. Role not in user_metadata
2. User not in shopkeepers table
3. Role is 'Shopkeeper' (capital S) instead of 'shopkeeper'

**Solution**:
1. Check user_metadata in Supabase
2. Check shopkeepers table
3. Verify role is lowercase

### Issue: Customer redirects to `/dashboard`

**Possible Causes**:
1. Role not in user_metadata
2. User not in customers table
3. Role is 'Customer' (capital C) instead of 'customer'

**Solution**:
1. Check user_metadata in Supabase
2. Check customers table
3. Verify role is lowercase

### Issue: Infinite redirect loop

**Possible Causes**:
1. AuthGuard redirecting to wrong dashboard
2. Role mismatch not handled correctly
3. localStorage not being set

**Solution**:
1. Check console logs for redirect decision
2. Check localStorage for role
3. Clear localStorage and re-login

### Issue: Role not persisting after refresh

**Possible Causes**:
1. Role not stored in localStorage
2. localStorage cleared on logout
3. Role not in user_metadata

**Solution**:
1. Check localStorage after login
2. Check that logout calls clearAuthCache()
3. Check user_metadata in Supabase

---

## FINAL VERIFICATION

After all tests pass:

- [ ] All 10 tests passed
- [ ] No console errors
- [ ] No redirect loops
- [ ] Role persists correctly
- [ ] Logout clears cache
- [ ] Multiple tabs consistent
- [ ] Invalid credentials handled
- [ ] Unverified email handled
- [ ] No session handled

---

## DEPLOYMENT CHECKLIST

Before deploying to production:

- [ ] All tests passed locally
- [ ] No console errors
- [ ] Build completes successfully
- [ ] No TypeScript errors
- [ ] localStorage keys are consistent
- [ ] Redirect logic is correct
- [ ] Error handling is complete
- [ ] Console logs are helpful for debugging

---

## MONITORING IN PRODUCTION

After deployment, monitor:

- [ ] User login success rate
- [ ] Redirect errors
- [ ] Role detection issues
- [ ] localStorage issues
- [ ] Console errors

---

## ROLLBACK PLAN

If issues occur in production:

1. Revert the three files to previous version
2. Clear browser cache
3. Investigate root cause
4. Re-deploy with fix

---

## Summary

This testing guide ensures that:
✅ Shopkeepers are redirected to `/dashboard`
✅ Customers are redirected to `/home`
✅ Role is properly stored and validated
✅ No incorrect redirects occur
✅ System is production-ready

---

**Status**: Ready to test
**Estimated Time**: 30-45 minutes
**Risk Level**: Low (frontend only)
**Rollback**: Easy (revert files)
