# Complete Testing Guide - SmartFetch Master Fix V6

## Pre-Testing Setup

### 1. Supabase Configuration
```sql
-- Run this in Supabase SQL Editor
-- File: SHOPKEEPER_SIGNUP_TRIGGER_UPDATE.sql

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

CREATE OR REPLACE FUNCTION handle_new_user() RETURNS TRIGGER AS $$
BEGIN
  BEGIN
    IF NEW.raw_user_meta_data->>'role' = 'shopkeeper' THEN
      INSERT INTO public.shopkeepers (id, full_name, email, phone, upi_id, gst_number, role)
      VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
        COALESCE(NEW.email, ''),
        NEW.raw_user_meta_data->>'phone',
        NEW.raw_user_meta_data->>'upi_id',
        NEW.raw_user_meta_data->>'gst_number',
        'shopkeeper'
      )
      ON CONFLICT (id) DO NOTHING;

      INSERT INTO public.shops (
        shopkeeper_id, name, category, address,
        latitude, longitude, is_active
      )
      VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'shop_name', 'My Shop'),
        NEW.raw_user_meta_data->>'category',
        NEW.raw_user_meta_data->>'location',
        (NEW.raw_user_meta_data->>'lat')::float,
        (NEW.raw_user_meta_data->>'lng')::float,
        true
      )
      ON CONFLICT DO NOTHING;

    ELSE
      INSERT INTO public.customers (id, full_name, email, phone, role)
      VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
        COALESCE(NEW.email, ''),
        NEW.raw_user_meta_data->>'phone',
        'customer'
      )
      ON CONFLICT (id) DO NOTHING;
    END IF;
  EXCEPTION WHEN OTHERS THEN
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
  END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### 2. Storage Buckets
Create two public buckets in Supabase:
- `shop-images` - For shop photos
- `product-images` - For product photos

### 3. Start Services
```bash
# Terminal 1: Frontend
cd frontend
npm run dev
# Runs on http://localhost:3003

# Terminal 2: Backend (if needed)
cd backend
npm start
# Runs on http://localhost:3005
```

---

## Test Suite 1: Shopkeeper Signup (Part 1)

### Test 1.1: Basic Signup Flow
**Objective**: Verify shopkeeper can sign up with all fields

**Steps**:
1. Navigate to `http://localhost:3003/signup?role=shopkeeper`
2. Fill in form:
   - Full Name: "John's Shop Owner"
   - Email: "shopkeeper@test.com"
   - Password: "SecurePass123!"
   - Confirm Password: "SecurePass123!"
   - Phone: "9876543210"
   - Shop Name: "John's Supermarket"
   - Category: "Supermarket"
   - UPI ID: "john@upi"
   - Shop Location: "123 Main Street, City"
   - GST Number: "22AAAAA0000A1Z5"
3. Click "Create Account"

**Expected Results**:
- ✅ Form validates all required fields
- ✅ Redirects to `/verify-notice`
- ✅ Email verification page displays

**Verification**:
- Check Supabase `shopkeepers` table - row created
- Check Supabase `shops` table - row created
- Check auth.users - user created with metadata

---

### Test 1.2: Geolocation Feature
**Objective**: Verify geolocation button fills location field

**Steps**:
1. Navigate to signup page with role=shopkeeper
2. Fill basic fields
3. Click "📍" button next to location field
4. Allow browser geolocation permission
5. Wait for location to populate

**Expected Results**:
- ✅ Location field auto-fills with address
- ✅ Latitude and longitude captured
- ✅ No errors in console

**Verification**:
- Check Supabase `shops` table - latitude/longitude saved

---

### Test 1.3: Shop Photo Upload
**Objective**: Verify shop photo uploads to storage

**Steps**:
1. Navigate to signup page with role=shopkeeper
2. Fill all required fields
3. Click "Choose File" for Shop Photo
4. Select an image file (JPG/PNG)
5. Complete signup

**Expected Results**:
- ✅ File selected and displayed
- ✅ Signup completes successfully
- ✅ Photo uploaded to storage

**Verification**:
- Check Supabase Storage `shop-images` bucket
- Verify file at path: `shop-images/{userId}/shop.jpg`
- Check `shops.image_url` - URL saved

---

### Test 1.4: Terms & Conditions Modal
**Objective**: Verify T&C and Privacy modals display

**Steps**:
1. Navigate to signup page with role=shopkeeper
2. Scroll to Terms & Conditions section
3. Click "Terms & Conditions" link
4. Read modal content
5. Click "Close"
6. Click "Privacy Policy" link
7. Read modal content
8. Click "Close"

**Expected Results**:
- ✅ T&C modal displays with full text
- ✅ Privacy modal displays with full text
- ✅ Close buttons work
- ✅ Modals are scrollable if content is long

---

### Test 1.5: Form Validation
**Objective**: Verify all validation rules

**Steps**:
1. Navigate to signup page with role=shopkeeper
2. Try submitting with empty fields
3. Try submitting without accepting terms
4. Try submitting with mismatched passwords
5. Try submitting with invalid email

**Expected Results**:
- ✅ Error message for each missing required field
- ✅ Error for unchecked terms
- ✅ Error for password mismatch
- ✅ Error for invalid email format

---

## Test Suite 2: Login & Redirect (Login Fix)

### Test 2.1: Shopkeeper Login Redirect
**Objective**: Verify shopkeeper redirects to dashboard

**Steps**:
1. Navigate to `http://localhost:3003/login`
2. Enter shopkeeper email and password
3. Click "Login"

**Expected Results**:
- ✅ Login successful
- ✅ Redirects to `/dashboard`
- ✅ Dashboard page loads
- ✅ Sidebar visible

---

### Test 2.2: Customer Login Redirect
**Objective**: Verify customer redirects to home

**Steps**:
1. Navigate to login page
2. Enter customer email and password
3. Click "Login"

**Expected Results**:
- ✅ Login successful
- ✅ Redirects to `/home`
- ✅ Home page loads

---

### Test 2.3: Unverified Email Error
**Objective**: Verify error for unverified email

**Steps**:
1. Create new account but don't verify email
2. Try to login
3. Observe error message

**Expected Results**:
- ✅ Error message: "Please verify your email first"
- ✅ Login fails
- ✅ User stays on login page

---

## Test Suite 3: Products Management (Part 3A)

### Test 3.1: Navigate to Products Page
**Objective**: Verify products page loads

**Steps**:
1. Login as shopkeeper
2. Click "📦 Products" in sidebar
3. Or navigate to `/dashboard/products`

**Expected Results**:
- ✅ Products page loads
- ✅ Header displays "My Products"
- ✅ Product count shows
- ✅ "+ Add Product" button visible
- ✅ Search bar visible

---

### Test 3.2: Add Product
**Objective**: Verify product can be added

**Steps**:
1. On products page, click "+ Add Product"
2. Fill in modal:
   - Product Name: "Basmati Rice 1kg"
   - Description: "Premium quality rice"
   - Price: "250"
   - Category: "Grocery"
   - Stock: "50"
3. Click "Add Product"

**Expected Results**:
- ✅ Modal opens
- ✅ Form fields display
- ✅ Product added successfully
- ✅ Modal closes
- ✅ Product appears in grid
- ✅ Product count increments

**Verification**:
- Check Supabase `products` table - row created

---

### Test 3.3: Upload Product Image
**Objective**: Verify product image uploads

**Steps**:
1. Click "+ Add Product"
2. Fill product details
3. Click "Choose File" for image
4. Select an image
5. Click "Add Product"

**Expected Results**:
- ✅ Image selected
- ✅ Product created with image
- ✅ Image displays on product card

**Verification**:
- Check Supabase Storage `product-images` bucket
- Verify file uploaded
- Check `products.image_url` - URL saved

---

### Test 3.4: Edit Product
**Objective**: Verify product can be edited

**Steps**:
1. On products page, find a product
2. Click "✏️ Edit" button
3. Change product name to "Basmati Rice 2kg"
4. Change price to "450"
5. Click "Save Changes"

**Expected Results**:
- ✅ Modal opens with current data
- ✅ Fields are editable
- ✅ Changes saved
- ✅ Product card updates
- ✅ Modal closes

**Verification**:
- Check Supabase `products` table - row updated

---

### Test 3.5: Toggle Availability
**Objective**: Verify product availability toggle

**Steps**:
1. Find a product on products page
2. Click "🔴 Hide" button
3. Verify button changes to "🟢 Show"
4. Click "🟢 Show"
5. Verify button changes back to "🔴 Hide"

**Expected Results**:
- ✅ Button text changes
- ✅ Badge color changes (green/red)
- ✅ Changes persist on refresh

**Verification**:
- Check Supabase `products.is_available` - value toggled

---

### Test 3.6: Delete Product
**Objective**: Verify product can be deleted

**Steps**:
1. Find a product on products page
2. Click "🗑️" button
3. Confirm deletion in browser dialog
4. Observe product removed

**Expected Results**:
- ✅ Confirmation dialog appears
- ✅ Product removed from grid
- ✅ Product count decrements
- ✅ Changes persist on refresh

**Verification**:
- Check Supabase `products` table - row deleted

---

### Test 3.7: Search Products
**Objective**: Verify search functionality

**Steps**:
1. Add multiple products with different names
2. Type in search bar: "Rice"
3. Observe filtered results
4. Clear search bar
5. Observe all products return

**Expected Results**:
- ✅ Search filters in real-time
- ✅ Only matching products display
- ✅ Clearing search shows all products

---

### Test 3.8: Empty State
**Objective**: Verify empty state displays

**Steps**:
1. Delete all products
2. Observe products page

**Expected Results**:
- ✅ Empty state message displays
- ✅ "📦" emoji shows
- ✅ "No products yet" message
- ✅ "Add Product" button visible

---

## Test Suite 4: Profile Management (Part 3B)

### Test 4.1: Navigate to Profile
**Objective**: Verify profile page loads

**Steps**:
1. Login as shopkeeper
2. Click "👤 Profile" in sidebar
3. Or navigate to `/dashboard/profile`

**Expected Results**:
- ✅ Profile page loads
- ✅ Avatar displays with initials
- ✅ Name and email display
- ✅ Edit form visible
- ✅ Menu links visible

---

### Test 4.2: Edit Profile
**Objective**: Verify profile can be edited

**Steps**:
1. On profile page, edit fields:
   - Full Name: "John Doe Updated"
   - Phone: "9876543211"
   - UPI ID: "john.updated@upi"
   - GST Number: "22BBBBB0000B2Z6"
2. Click "Save Changes"
3. Observe success message

**Expected Results**:
- ✅ Fields are editable
- ✅ Save button works
- ✅ Success message displays
- ✅ Message disappears after 3 seconds

**Verification**:
- Check Supabase `shopkeepers` table - row updated
- Refresh page - changes persist

---

### Test 4.3: Menu Links
**Objective**: Verify menu links navigate correctly

**Steps**:
1. On profile page, click each menu link:
   - "🏪 My Shop Settings"
   - "📦 Manage Products"
   - "📋 View Orders"
   - "📄 Terms & Conditions"
   - "🔒 Privacy Policy"

**Expected Results**:
- ✅ Each link navigates to correct page
- ✅ Pages load without errors
- ✅ Can navigate back to profile

---

### Test 4.4: Logout
**Objective**: Verify logout functionality

**Steps**:
1. On profile page, click "🚪 Logout"
2. Observe redirect

**Expected Results**:
- ✅ User logged out
- ✅ Redirects to `/login`
- ✅ Session cleared
- ✅ Cannot access dashboard without login

---

### Test 4.5: Delete Account
**Objective**: Verify account deletion

**Steps**:
1. On profile page, click "🗑️ Delete Account"
2. Read confirmation message
3. Click "Delete Forever"
4. Observe redirect

**Expected Results**:
- ✅ Confirmation modal displays
- ✅ Warning message clear
- ✅ Account deleted
- ✅ Redirects to home page
- ✅ Cannot login with deleted account

**Verification**:
- Check Supabase `shopkeepers` table - row deleted
- Try logging in - should fail

---

### Test 4.6: Delete Account Cancel
**Objective**: Verify delete can be cancelled

**Steps**:
1. On profile page, click "🗑️ Delete Account"
2. Click "Cancel"
3. Observe modal closes

**Expected Results**:
- ✅ Modal closes
- ✅ User stays on profile page
- ✅ Account not deleted

---

## Test Suite 5: Dashboard Navigation

### Test 5.1: Sidebar Navigation
**Objective**: Verify sidebar menu works

**Steps**:
1. Login as shopkeeper
2. Click each menu item:
   - 📊 Overview
   - 🏪 My Shop
   - 📦 Products
   - 📋 Orders
   - 📷 Scanner
   - 👤 Profile

**Expected Results**:
- ✅ Each item navigates to correct page
- ✅ Active item highlighted
- ✅ Sidebar visible on all pages

---

### Test 5.2: Active State Highlighting
**Objective**: Verify active menu item highlighted

**Steps**:
1. Navigate to `/dashboard/products`
2. Observe sidebar
3. Navigate to `/dashboard/profile`
4. Observe sidebar

**Expected Results**:
- ✅ Products item highlighted when on products page
- ✅ Profile item highlighted when on profile page
- ✅ Highlighting changes as you navigate

---

## Test Suite 6: Data Persistence

### Test 6.1: Refresh Page
**Objective**: Verify data persists on refresh

**Steps**:
1. Add a product
2. Refresh page (F5)
3. Observe product still there

**Expected Results**:
- ✅ Product still displays
- ✅ Data loaded from Supabase
- ✅ No data loss

---

### Test 6.2: Browser Back Button
**Objective**: Verify navigation with back button

**Steps**:
1. Navigate to products page
2. Click a product to edit
3. Click browser back button
4. Observe products page

**Expected Results**:
- ✅ Back button works
- ✅ Products page displays
- ✅ No errors

---

## Test Suite 7: Error Handling

### Test 7.1: Network Error
**Objective**: Verify error handling for network issues

**Steps**:
1. Open DevTools (F12)
2. Go to Network tab
3. Check "Offline"
4. Try to load products page
5. Observe error handling

**Expected Results**:
- ✅ Error message displays
- ✅ Page doesn't crash
- ✅ User can retry

---

### Test 7.2: Invalid Data
**Objective**: Verify validation of invalid data

**Steps**:
1. Try to add product with:
   - Empty name
   - Negative price
   - Invalid characters

**Expected Results**:
- ✅ Validation prevents submission
- ✅ Error messages display
- ✅ Form doesn't submit

---

## Test Suite 8: Image Handling

### Test 8.1: Large Image Upload
**Objective**: Verify handling of large images

**Steps**:
1. Try to upload image > 5MB
2. Observe handling

**Expected Results**:
- ✅ Either uploads successfully or shows error
- ✅ No page crash
- ✅ User informed of result

---

### Test 8.2: Invalid Image Format
**Objective**: Verify handling of invalid formats

**Steps**:
1. Try to upload non-image file (PDF, TXT)
2. Observe handling

**Expected Results**:
- ✅ File input accepts only images
- ✅ Or shows error if uploaded
- ✅ No page crash

---

## Test Suite 9: Cross-Browser Testing

### Test 9.1: Chrome
- [ ] All tests pass in Chrome

### Test 9.2: Firefox
- [ ] All tests pass in Firefox

### Test 9.3: Safari
- [ ] All tests pass in Safari

### Test 9.4: Edge
- [ ] All tests pass in Edge

---

## Test Suite 10: Performance

### Test 10.1: Page Load Time
**Objective**: Verify acceptable load times

**Steps**:
1. Open DevTools
2. Go to Performance tab
3. Load products page
4. Observe load time

**Expected Results**:
- ✅ Page loads in < 3 seconds
- ✅ No long blocking operations
- ✅ Smooth animations

---

### Test 10.2: Search Performance
**Objective**: Verify search is responsive

**Steps**:
1. Add 50+ products
2. Type in search bar
3. Observe responsiveness

**Expected Results**:
- ✅ Search filters instantly
- ✅ No lag or delay
- ✅ Smooth typing experience

---

## Final Verification Checklist

### Functionality
- [ ] All signup fields work
- [ ] Geolocation works
- [ ] Photo uploads work
- [ ] Login redirects correctly
- [ ] Products CRUD works
- [ ] Profile editing works
- [ ] Logout works
- [ ] Delete account works

### Data
- [ ] Shopkeeper rows created
- [ ] Shop rows created
- [ ] Product rows created
- [ ] Images uploaded to storage
- [ ] Data persists on refresh

### UI/UX
- [ ] All pages load
- [ ] Sidebar navigation works
- [ ] Modals display correctly
- [ ] Forms validate
- [ ] Error messages clear
- [ ] Success messages display

### Performance
- [ ] Pages load quickly
- [ ] Search is responsive
- [ ] No console errors
- [ ] No memory leaks

### Security
- [ ] Protected routes work
- [ ] Unauthorized access blocked
- [ ] Session management works
- [ ] Data encrypted in transit

---

## Test Results Summary

| Test Suite | Status | Notes |
|-----------|--------|-------|
| 1. Signup | ⏳ Pending | |
| 2. Login | ⏳ Pending | |
| 3. Products | ⏳ Pending | |
| 4. Profile | ⏳ Pending | |
| 5. Navigation | ⏳ Pending | |
| 6. Persistence | ⏳ Pending | |
| 7. Errors | ⏳ Pending | |
| 8. Images | ⏳ Pending | |
| 9. Browsers | ⏳ Pending | |
| 10. Performance | ⏳ Pending | |

---

**Testing Status**: Ready to begin ✅
