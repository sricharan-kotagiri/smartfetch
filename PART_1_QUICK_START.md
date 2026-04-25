# PART 1: Shopkeeper Signup - Quick Start Guide

## What Was Done ✅

Updated `frontend/src/pages/signup.tsx` with complete shopkeeper signup flow:

### Frontend Changes
- ✅ Added 10 state variables for shopkeeper fields
- ✅ Added geolocation handler using OpenStreetMap Nominatim API
- ✅ Added form validation for all shopkeeper fields
- ✅ Updated handleSignup to include all fields in Supabase metadata
- ✅ Added photo upload to Supabase Storage
- ✅ Added Terms & Conditions and Privacy Policy modals
- ✅ Conditional rendering of shopkeeper fields when role='shopkeeper'

### Shopkeeper Form Fields (When role='shopkeeper')
1. Shop Name (Required)
2. Category (Required) - 7 options
3. UPI ID (Required)
4. Shop Location (Required) - with geolocation button
5. GST Number (Optional)
6. Shop Photo (Optional)
7. Terms & Conditions (Required) - with modal links

## What You Need to Do

### Step 1: Update Supabase Trigger
Run this SQL in Supabase Dashboard → SQL Editor:

**File**: `SHOPKEEPER_SIGNUP_TRIGGER_UPDATE.sql`

This creates both `shopkeepers` and `shops` rows with all metadata fields.

### Step 2: Test the Signup Flow

1. Go to: `http://localhost:3003/signup?role=shopkeeper`
2. Fill in all fields:
   - Basic: Name, Email, Password, Phone
   - Shopkeeper: Shop Name, Category, UPI ID, Location
   - Optional: GST Number, Shop Photo
3. Click geolocation button (📍) to auto-fill location
4. Accept Terms & Conditions
5. Click "Create Account"
6. Should redirect to `/verify-notice`

### Step 3: Verify in Supabase

After signup, check:
- ✅ `auth.users` - user created with metadata
- ✅ `shopkeepers` table - row created with shop details
- ✅ `shops` table - row created with shop info
- ✅ `shop-images` storage - photo uploaded (if provided)
- ✅ `shops.image_url` - photo URL saved (after 2 seconds)

## Key Features

### Geolocation
- Click 📍 button to get current location
- Uses browser Geolocation API
- Reverse geocodes using OpenStreetMap Nominatim (free, no API key)
- Auto-fills location field with address
- Stores latitude/longitude for database

### Photo Upload
- Optional file upload
- Uploaded to: `shop-images/{userId}/shop.jpg`
- Public URL saved to `shops.image_url` after 2-second delay
- Failure doesn't block signup

### Terms & Conditions
- Required checkbox for shopkeepers
- Click links to view full T&C and Privacy Policy
- Modal dialogs with scrollable content

### Validation
- All required fields validated before submission
- Clear error messages
- Form won't submit if validation fails

## Important Notes

1. **Redirect URL**: Changed to `http://localhost:3006/verify-success`
2. **Database Trigger**: Must be updated in Supabase before testing
3. **Geolocation**: Requires HTTPS in production (works on localhost)
4. **Photo Upload**: Requires Supabase Storage bucket `shop-images` with public access

## Files Modified
- `frontend/src/pages/signup.tsx` - Main implementation

## Files Created
- `SHOPKEEPER_SIGNUP_TRIGGER_UPDATE.sql` - Trigger SQL
- `PART_1_SHOPKEEPER_SIGNUP_COMPLETE.md` - Full documentation
- `PART_1_QUICK_START.md` - This file

## Next Steps

After Part 1 is verified working:
1. User provides **Part 2 prompt** for Dashboard fix
2. User provides **Part 3 prompt** for Profile + Scanner

---

**Status**: ✅ PART 1 COMPLETE - Ready for testing
