# Database Query Fixes - Quick Reference

## 4 Files Fixed ✅

### FIX 1: login.tsx
**Line**: ~85 in handleSubmit  
**Change**: `.eq('id', userId)` → `.eq('user_id', userId)`  
**File**: frontend/src/pages/login.tsx

### FIX 2: products.tsx
**Lines**: ~35-43 in fetchProducts  
**Change**: Replaced entire function to use 2-step lookup:
1. Get shopkeeper using `user_id`
2. Get shop using `shopkeeper.id`  
**File**: frontend/src/pages/products.tsx

### FIX 3: shopkeeper-profile.tsx
**Three bugs fixed**:
1. **Line ~32** (fetchProfile): `.eq('id', session.user.id)` → `.eq('user_id', session.user.id)`
2. **Line ~48** (handleSave): `.eq('id', userId)` → `.eq('user_id', userId)`
3. **Lines ~60-80** (handleDeleteAccount): Replaced entire function with 2-step lookup  
**File**: frontend/src/pages/shopkeeper-profile.tsx

### FIX 4: shop-setup.tsx
**Two occurrences**:
1. **Line ~57** (checkShop): `navigate('/shopkeeper-dashboard')` → `navigate('/dashboard')`
2. **Line ~189** (handleSubmit): `navigate('/shopkeeper-dashboard')` → `navigate('/dashboard')`  
**File**: frontend/src/pages/shop-setup.tsx

---

## Build Status
✅ **SUCCESS** - No TypeScript errors, all imports resolve

---

## Key Rules
- `shopkeepers.user_id` = auth user ID
- `shops.shopkeeper_id` = shopkeepers.id (NOT auth user id)
- Always use 2-step lookup: auth user → shopkeeper → shop
