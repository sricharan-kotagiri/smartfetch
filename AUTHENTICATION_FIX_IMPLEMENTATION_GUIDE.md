# SmartFetch Authentication Fix - Implementation Guide

## Overview

This guide provides step-by-step instructions to fix the authentication system so that:
- Shopkeepers are redirected to `/dashboard`
- Customers are redirected to `/home`
- Role is properly stored and validated
- No incorrect redirects occur

---

## STEP 1: Update Frontend Auth Library

**File**: `frontend/src/lib/auth.ts`

Replace the entire file with the content from `CORRECTED_AUTH_LIB.ts`

**Key Changes**:
- Uses `sf_user_role` as localStorage key (consistent naming)
- Validates role is 'customer' or 'shopkeeper'
- Adds console logs for debugging
- Includes `isValidRole()` and `getRoleFromSession()` functions

**Verification**:
```bash
# Check that the file compiles without errors
npm run build
```

---

## STEP 2: Update Frontend Login Handler

**File**: `frontend/src/pages/login.tsx`

Replace the entire file with the content from `CORRECTED_LOGIN_HANDLER.tsx`

**Key Changes**:
- Extracts role from `user_metadata`
- Stores role in localStorage with key `sf_user_role`
- Validates role before redirect
- Adds console logs for debugging
- Redirects based on role:
  - `shopkeeper` → `/dashboard`
  - `customer` → `/home`
- Fallback to database tables if role not in metadata

**Verification**:
```bash
# Check that the file compiles without errors
npm run build
```

---

## STEP 3: Update Frontend AuthGuard Component

**File**: `frontend/src/components/AuthGuard.tsx`

Replace the entire file with the content from `CORRECTED_AUTHGUARD.tsx`

**Key Changes**:
- Checks localStorage for role first (fast path)
- Validates role matches required role
- Redirects on role mismatch
- Adds console logs for debugging
- Handles missing role gracefully
- Shows loading state while checking

**Verification**:
```bash
# Check that the file compiles without errors
npm run build
```

---

## STEP 4: Verify Signup Stores Role in Metadata

**File**: `frontend/src/pages/signup.tsx`

Check that the signup is storing role in user_metadata (it should already be doing this):

```typescript
const { data, error } = await supabase.auth.signUp({
  email: formData.email,
  password: formData.password,
  options: {
    data: {
      full_name: formData.fullName,
      role: role,  // ✅ This should be 'customer' or 'shopkeeper'
      phone: formData.phone || null,
      // ... other fields
    },
    emailRedirectTo: 'http://localhost:3006/verify-success'
  }
})
```

**Verification**:
- Signup page should have `role` parameter in URL: `/signup?role=shopkeeper`
- Role should be stored in user_metadata during signup

---

## STEP 5: Build and Test

### Build Frontend
```bash
cd frontend
npm run build
```

**Expected Output**:
- No TypeScript errors
- No compilation warnings
- Build completes successfully

### Test Login Flow

#### Test 1: Shopkeeper Login
1. Go to `/signup?role=shopkeeper`
2. Fill in shopkeeper details
3. Complete signup
4. Go to `/login`
5. Login with shopkeeper email
6. **Expected**: Redirected to `/dashboard`
7. **Check Console**: Should see logs like:
   ```
   🔐 [LOGIN] Starting login process...
   ✅ [LOGIN] Auth successful for user: [user-id]
   🎭 [LOGIN] Role from metadata: shopkeeper
   💾 [LOGIN] Stored role in localStorage: shopkeeper
   🔀 [LOGIN] Redirecting to /dashboard (shopkeeper)
   ```

#### Test 2: Customer Login
1. Go to `/signup?role=customer` (or just `/signup`)
2. Fill in customer details
3. Complete signup
4. Go to `/login`
5. Login with customer email
6. **Expected**: Redirected to `/home`
7. **Check Console**: Should see logs like:
   ```
   🔐 [LOGIN] Starting login process...
   ✅ [LOGIN] Auth successful for user: [user-id]
   🎭 [LOGIN] Role from metadata: customer
   💾 [LOGIN] Stored role in localStorage: customer
   🔀 [LOGIN] Redirecting to /home (customer)
   ```

#### Test 3: Wrong Role Access
1. Login as shopkeeper
2. Try to access `/home` (customer page)
3. **Expected**: Redirected back to `/dashboard`
4. **Check Console**: Should see logs like:
   ```
   🔐 [AUTHGUARD] Checking access for role: customer
   ✅ [AUTHGUARD] Session found for user: [user-id]
   💾 [AUTHGUARD] Cached role from localStorage: shopkeeper
   ⚠️ [AUTHGUARD] Role mismatch! User has: shopkeeper but needs: customer
   🔀 [AUTHGUARD] Redirecting to correct dashboard: /dashboard
   ```

#### Test 4: Logout and Re-login
1. Login as shopkeeper
2. Logout
3. **Expected**: Role cleared from localStorage
4. Login again
5. **Expected**: Redirected to `/dashboard` again

---

## STEP 6: Debugging Checklist

After implementing the fixes, verify:

- [ ] Signup stores role in user_metadata
- [ ] Login extracts role from user_metadata
- [ ] Role is stored in localStorage with key `sf_user_role`
- [ ] Shopkeeper login redirects to `/dashboard`
- [ ] Customer login redirects to `/home`
- [ ] Wrong role access redirects to correct dashboard
- [ ] Logout clears role from localStorage
- [ ] Console logs show correct flow
- [ ] No console errors
- [ ] AuthGuard validates role correctly
- [ ] Cached role is used on subsequent page loads

---

## STEP 7: Browser DevTools Verification

### Check localStorage
1. Open browser DevTools (F12)
2. Go to Application → Local Storage
3. After login, verify:
   - `sf_user_role` = `'shopkeeper'` or `'customer'`
   - `sf_user_id` = user ID

### Check Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Perform login
4. Verify console logs show correct flow

### Check Network
1. Open browser DevTools (F12)
2. Go to Network tab
3. Perform login
4. Check that auth request returns correct role in response

---

## STEP 8: Common Issues and Solutions

### Issue: Shopkeeper redirects to `/home`

**Cause**: Role not stored in user_metadata or not extracted correctly

**Solution**:
1. Check signup stores role in user_metadata
2. Check login extracts role from user_metadata
3. Check console logs for role value
4. Verify role is 'shopkeeper' (lowercase, exact match)

### Issue: Customer redirects to `/dashboard`

**Cause**: Role detected as 'shopkeeper' when it should be 'customer'

**Solution**:
1. Check database tables (customers vs shopkeepers)
2. Check console logs for which table user is found in
3. Verify role in user_metadata

### Issue: Infinite redirect loop

**Cause**: AuthGuard redirecting to wrong dashboard repeatedly

**Solution**:
1. Check localStorage for correct role
2. Check console logs for redirect decision
3. Verify role matches required role
4. Clear localStorage and re-login

### Issue: Role not persisting after page refresh

**Cause**: Role not stored in localStorage or cleared on logout

**Solution**:
1. Check localStorage after login
2. Check that logout calls `clearAuthCache()`
3. Verify role is stored with correct key `sf_user_role`

---

## STEP 9: Production Deployment

Before deploying to production:

1. **Test all scenarios**:
   - Shopkeeper signup and login
   - Customer signup and login
   - Wrong role access
   - Logout and re-login
   - Page refresh with cached role

2. **Verify console logs**:
   - No errors
   - Correct flow shown in logs
   - Role correctly identified

3. **Check localStorage**:
   - Role stored correctly
   - Role cleared on logout
   - Role persists on page refresh

4. **Monitor in production**:
   - Watch for redirect issues
   - Monitor console for errors
   - Check user feedback

---

## STEP 10: Rollback Plan

If issues occur in production:

1. **Revert to previous version**:
   ```bash
   git revert [commit-hash]
   ```

2. **Clear browser cache**:
   - Users should clear localStorage
   - Clear browser cache

3. **Investigate**:
   - Check console logs
   - Check localStorage
   - Check database for role values

---

## Summary

After implementing these fixes:

✅ Shopkeepers will be redirected to `/dashboard`
✅ Customers will be redirected to `/home`
✅ Role will be properly stored and validated
✅ No incorrect redirects will occur
✅ Console logs will show the authentication flow
✅ Role will persist across page refreshes
✅ Role will be cleared on logout

---

## Files to Update

1. `frontend/src/lib/auth.ts` - Auth library
2. `frontend/src/pages/login.tsx` - Login handler
3. `frontend/src/components/AuthGuard.tsx` - Route protection

## Files to Verify

1. `frontend/src/pages/signup.tsx` - Should already store role in metadata
2. `frontend/src/App.tsx` - Routes should be correct

## Reference Files

1. `CORRECTED_AUTH_LIB.ts` - Corrected auth library
2. `CORRECTED_LOGIN_HANDLER.tsx` - Corrected login handler
3. `CORRECTED_AUTHGUARD.tsx` - Corrected AuthGuard component

---

**Status**: Ready to implement
**Estimated Time**: 15-20 minutes
**Risk Level**: Low (frontend only, no database changes)
**Rollback**: Easy (revert files)
