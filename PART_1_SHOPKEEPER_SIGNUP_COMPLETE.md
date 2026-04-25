# PART 1: Shopkeeper Signup Fields - COMPLETE ✅

## Summary
Successfully implemented all shopkeeper-specific signup fields in the SignupPage component. The form now collects all required information for shopkeeper registration with proper validation and Supabase integration.

## Changes Made

### 1. Frontend: `frontend/src/pages/signup.tsx`

#### Added State Variables
```typescript
// Shopkeeper fields
const [shopName, setShopName] = useState('')
const [category, setCategory] = useState('')
const [upiId, setUpiId] = useState('')
const [location, setLocation] = useState('')
const [lat, setLat] = useState<number | null>(null)
const [lng, setLng] = useState<number | null>(null)
const [gstNumber, setGstNumber] = useState('')
const [shopPhoto, setShopPhoto] = useState<File | null>(null)
const [termsAccepted, setTermsAccepted] = useState(false)
const [showTerms, setShowTerms] = useState(false)
const [showPrivacy, setShowPrivacy] = useState(false)
```

#### Added Geolocation Handler
- Uses browser's Geolocation API to get current position
- Calls OpenStreetMap Nominatim API for reverse geocoding
- Automatically fills location field with address
- Stores latitude and longitude for database

#### Updated Form Validation
- Validates all shopkeeper fields when role is 'shopkeeper'
- Checks: shop name, category, UPI ID, location, terms acceptance
- Provides clear error messages for missing fields

#### Updated handleSignup Function
- Includes all shopkeeper fields in Supabase auth metadata
- Handles shop photo upload to Supabase Storage (`shop-images/{userId}/shop.jpg`)
- Updates shops table with photo URL after trigger creates row (2-second delay)
- Changed redirect URL to `http://localhost:3006/verify-success`
- Gracefully handles photo upload failures

#### Added Shopkeeper Form Fields (Conditional Rendering)
When `role === 'shopkeeper'`, displays:
1. **Shop Name** (Required) - Text input
2. **Category** (Required) - Dropdown with 7 options:
   - Supermarket
   - Food & Restaurant
   - Pharmacy
   - Electronics
   - Clothing
   - General Store
   - Other
3. **UPI ID** (Required) - Text input with format hint
4. **Shop Location** (Required) - Text input with geolocation button
5. **GST Number** (Optional) - Text input
6. **Shop Photo** (Optional) - File upload
7. **Terms & Conditions** (Required) - Checkbox with modal links

#### Added Modal Dialogs
- **Terms & Conditions Modal** - Displays full T&C text with close button
- **Privacy Policy Modal** - Displays full privacy policy text with close button
- Both modals are clickable from the checkbox area

### 2. Database: Supabase SQL Trigger

**File**: `SHOPKEEPER_SIGNUP_TRIGGER_UPDATE.sql`

The trigger has been updated to:
- Create `shopkeepers` row with: id, full_name, email, phone, upi_id, gst_number, role
- Create `shops` row with: shopkeeper_id, name, category, address, latitude, longitude, is_active
- Extract all metadata fields from auth.users.raw_user_meta_data
- Handle both shopkeeper and customer signups

**Action Required**: Run the SQL in Supabase Dashboard → SQL Editor

## Data Flow

### Signup Process
1. User selects "Become a Shopkeeper" on landing page
2. Fills basic fields: Full Name, Email, Password, Phone
3. Fills shopkeeper fields: Shop Name, Category, UPI ID, Location, etc.
4. Accepts Terms & Conditions
5. Clicks "Create Account"

### Validation
- All required fields validated before submission
- Geolocation optional but recommended
- Photo upload optional

### Supabase Auth
- User created in `auth.users` with metadata containing all fields
- Trigger automatically creates:
  - `shopkeepers` row with basic info
  - `shops` row with shop details

### Photo Upload
- Uploaded to Supabase Storage: `shop-images/{userId}/shop.jpg`
- Public URL saved to `shops.image_url` after 2-second delay
- Failure doesn't block signup process

## Testing Checklist

- [ ] Navigate to signup page with `?role=shopkeeper` parameter
- [ ] Verify all shopkeeper fields appear below phone field
- [ ] Test geolocation button (📍) - should fill location field
- [ ] Test category dropdown - should show all 7 options
- [ ] Test form validation - try submitting without required fields
- [ ] Test Terms & Conditions modal - click link and verify modal appears
- [ ] Test Privacy Policy modal - click link and verify modal appears
- [ ] Upload a shop photo - verify file is selected
- [ ] Submit form - verify redirect to verify-notice page
- [ ] Check Supabase: verify shopkeeper and shops rows created
- [ ] Check Supabase Storage: verify shop photo uploaded
- [ ] Check shops.image_url: verify photo URL saved

## Important Notes

1. **Redirect URL**: Changed from `localhost:3005` to `localhost:3006` for email verification
2. **Geolocation**: Uses OpenStreetMap Nominatim (free, no API key needed)
3. **Photo Upload**: Optional but recommended for shop visibility
4. **Terms Acceptance**: Required for shopkeepers (checkbox validation)
5. **Database Trigger**: Must be updated in Supabase dashboard before testing

## Next Steps

After Part 1 is verified working:
- User will provide **Part 2 prompt** for Dashboard fix
- User will provide **Part 3 prompt** for Profile + Scanner

## Files Modified
- `frontend/src/pages/signup.tsx` - Main implementation

## Files Created
- `SHOPKEEPER_SIGNUP_TRIGGER_UPDATE.sql` - Trigger SQL to run in Supabase
- `PART_1_SHOPKEEPER_SIGNUP_COMPLETE.md` - This document
