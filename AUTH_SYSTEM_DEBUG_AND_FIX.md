# SmartFetch Authentication System - Complete Debug & Fix Guide

## PROBLEM ANALYSIS

### Current Issues Identified

1. **Dual Authentication Systems**
   - Frontend uses Supabase Auth (email/password)
   - Backend has OTP auth (phone-based)
   - They don't communicate properly

2. **Role Storage Problem**
   - Supabase Auth doesn't store role in user_metadata
   - Role is stored in separate `customers`/`shopkeepers` tables
   - No guarantee role is set during signup

3. **Redirect Logic Issue**
   - Login redirects based on `getUserRole()` which checks separate tables
   - If role not found in tables, defaults to customer
   - Shopkeeper users get redirected to `/home` instead of `/dashboard`

4. **Missing Role Validation**
   - No validation that role is set during signup
   - No validation that role is returned from login API
   - No validation in JWT token

### Root Cause

When a shopkeeper signs up:
1. Supabase creates auth user (no role stored)
2. Frontend tries to insert into `shopkeepers` table
3. If insert fails or role not set, user defaults to customer
4. Login checks `shopkeepers` table, doesn't find user
5. Checks `customers` table, finds user (or creates one)
6. Redirects to `/home` instead of `/dashboard`

---

## SOLUTION ARCHITECTURE

### Phase 1: Backend Fixes
- Ensure role is stored in Supabase user_metadata
- Ensure role is returned in login API response
- Ensure JWT includes role
- Add role validation

### Phase 2: Frontend Fixes
- Store role from login response
- Use role from localStorage for redirects
- Add console logs for debugging
- Validate role before redirect

### Phase 3: Route Protection
- Verify role in AuthGuard
- Redirect on role mismatch
- Handle missing role

---

## IMPLEMENTATION PLAN

### Backend Changes Required

1. **Update Signup to Store Role in Metadata**
   - When creating Supabase auth user, set role in user_metadata
   - Ensure role is 'customer' or 'shopkeeper' (no defaults)

2. **Update Login to Return Role**
   - Query user_metadata for role
   - Return role in API response
   - Include role in JWT token

3. **Add Role Validation**
   - Validate role is 'customer' or 'shopkeeper'
   - Reject invalid roles
   - Log role decisions

### Frontend Changes Required

1. **Update Login Handler**
   - Extract role from API response
   - Store role in localStorage
   - Log role before redirect
   - Redirect based on role

2. **Update AuthGuard**
   - Check localStorage for role
   - Validate role matches required role
   - Redirect on mismatch

3. **Add Debugging**
   - Console log API response
   - Console log stored role
   - Console log redirect decision

---

## DEBUGGING CHECKLIST

After implementing fixes, verify:

- [ ] Signup as shopkeeper stores role in Supabase metadata
- [ ] Login API returns role in response
- [ ] Role is stored in localStorage after login
- [ ] Shopkeeper redirects to `/dashboard`
- [ ] Customer redirects to `/home`
- [ ] Wrong role access redirects correctly
- [ ] Logout clears role from localStorage
- [ ] No console errors
- [ ] JWT token includes role

---

## NEXT STEPS

1. Implement backend fixes
2. Implement frontend fixes
3. Test each scenario
4. Verify console logs
5. Deploy and monitor

