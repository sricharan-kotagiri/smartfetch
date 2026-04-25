# Location Detection Setup Guide

Complete guide to add location detection to your SmartFetch frontend.

## Files Created

1. **frontend/public/location.js** - Vanilla JavaScript location detection
2. **frontend/src/components/LocationDetector.tsx** - React component version
3. **LOCATION_SETUP.md** - This guide

## Option 1: Using React Component (Recommended for Next.js)

### Step 1: Import LocationDetector in Your Navbar

Edit your navbar component (e.g., `components/app-header.tsx`):

```tsx
import { LocationDetector } from '@/components/LocationDetector'

export function AppHeader() {
  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold">SmartFetch</div>

        {/* Location Detector - ADD THIS */}
        <div className="flex-1 mx-8">
          <LocationDetector />
        </div>

        {/* Other navbar items */}
        <div className="flex items-center gap-4">
          {/* Your existing navbar items */}
        </div>
      </div>
    </header>
  )
}
```

### Step 2: Use in Your App

The LocationDetector component will:
- Automatically detect location on page load
- Show "📍 City, State" in the navbar
- Display a "Change" button to update location
- Save location to localStorage
- Show manual input if location permission denied

## Option 2: Using Vanilla JavaScript

### Step 1: Add Script Tag to HTML

Add this to the bottom of your HTML file (before closing `</body>`):

```html
<!-- Location Detection -->
<script src="/location.js"></script>
```

### Step 2: Add Location Display Element

Add this element to your navbar HTML:

```html
<nav class="navbar">
  <div class="navbar-container">
    <!-- Logo -->
    <div class="navbar-logo">SmartFetch</div>

    <!-- Location Display - ADD THIS -->
    <div id="user-location" class="navbar-location"></div>

    <!-- Other navbar items -->
    <div class="navbar-items">
      <!-- Your existing items -->
    </div>
  </div>
</nav>
```

### Step 3: Add CSS (Optional)

The location.js file includes built-in styles, but you can customize:

```css
.location-display {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: #f0f9ff;
  border-radius: 6px;
  border: 1px solid #bfdbfe;
}

.location-text {
  font-size: 14px;
  color: #1e40af;
  font-weight: 500;
}

.location-change-btn {
  padding: 4px 8px;
  font-size: 12px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.location-change-btn:hover {
  background-color: #2563eb;
}
```

## How It Works

### On Page Load
1. Check if location saved in localStorage
2. If saved, display it
3. If not saved, request geolocation permission

### Location Detection Flow
```
User visits page
    ↓
Check localStorage for saved location
    ↓
If saved: Display location
If not saved: Request geolocation permission
    ↓
Get latitude and longitude
    ↓
Call Nominatim API to convert to address
    ↓
Extract city, state, postcode
    ↓
Save to localStorage
    ↓
Display in navbar with "Change" button
```

### If Permission Denied
- Show manual input field
- User can type city name
- Save to localStorage
- Display in navbar

### Change Location
- Click "Change" button
- Clear localStorage
- Request new location
- Repeat detection process

## Data Stored in localStorage

### Key: `smartfetch_location`
```
Value: "Kukatpally, Telangana"
```

### Key: `smartfetch_lat`
```
Value: "17.3850"
```

### Key: `smartfetch_lon`
```
Value: "78.4867"
```

## Accessing Location Data in Your Code

### Using React Component
```tsx
// The LocationDetector component handles everything automatically
// Location data is saved in localStorage
```

### Using Vanilla JavaScript
```javascript
// Get location manager instance
const locationData = window.locationManager.getAllLocationData()

// Returns:
{
  location: "Kukatpally, Telangana",
  latitude: 17.3850,
  longitude: 78.4867
}

// Or get individual values
const city = window.locationManager.getSavedLocation()
const lat = window.locationManager.getSavedLatitude()
const lon = window.locationManager.getSavedLongitude()
```

### Using localStorage Directly
```javascript
// Get location
const location = localStorage.getItem('smartfetch_location')

// Get coordinates
const lat = localStorage.getItem('smartfetch_lat')
const lon = localStorage.getItem('smartfetch_lon')
```

## Features

✅ Automatic location detection on page load
✅ Uses browser Geolocation API
✅ Converts coordinates to address using Nominatim API
✅ Saves location in localStorage
✅ Shows "Change" button to update location
✅ Manual input if permission denied
✅ Saves latitude and longitude for filtering
✅ Responsive design
✅ No external dependencies (vanilla JS version)
✅ Works offline (uses cached location)

## API Used

**Nominatim OpenStreetMap API**
- Free and open-source
- No API key required
- Converts coordinates to address
- Rate limited to 1 request per second

Example API call:
```
https://nominatim.openstreetmap.org/reverse?lat=17.3850&lon=78.4867&format=json
```

Response:
```json
{
  "address": {
    "city": "Kukatpally",
    "state": "Telangana",
    "postcode": "500072",
    "country": "India"
  }
}
```

## Navbar Integration Examples

### Example 1: Simple Navbar
```html
<nav class="navbar">
  <div class="navbar-content">
    <h1>SmartFetch</h1>
    <div id="user-location"></div>
    <button>Login</button>
  </div>
</nav>
```

### Example 2: Bootstrap Navbar
```html
<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">SmartFetch</a>
    <div id="user-location" class="mx-auto"></div>
    <button class="btn btn-primary">Login</button>
  </div>
</nav>
```

### Example 3: Tailwind Navbar
```html
<nav class="bg-white border-b">
  <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
    <h1 class="text-2xl font-bold">SmartFetch</h1>
    <div id="user-location"></div>
    <button class="bg-blue-600 text-white px-4 py-2 rounded">Login</button>
  </div>
</nav>
```

### Example 4: React Component
```tsx
import { LocationDetector } from '@/components/LocationDetector'

export function Navbar() {
  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">SmartFetch</h1>
        <LocationDetector />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Login</button>
      </div>
    </nav>
  )
}
```

## Testing

### Test 1: First Visit
1. Open http://localhost:3000
2. Browser asks for location permission
3. Click "Allow"
4. Location appears in navbar
5. Refresh page - location still shows (from localStorage)

### Test 2: Change Location
1. Click "Change" button
2. Browser asks for location permission again
3. Click "Allow"
4. New location appears

### Test 3: Permission Denied
1. Open in private/incognito window
2. Click "Deny" on location permission
3. Manual input field appears
4. Type city name and press Enter
5. Location saved and displayed

### Test 4: Check localStorage
1. Open DevTools (F12)
2. Go to Application → Local Storage
3. Find `smartfetch_location`, `smartfetch_lat`, `smartfetch_lon`
4. Verify values are saved

## Troubleshooting

### Location not detecting
- Check browser supports Geolocation API
- Check location permission is granted
- Check internet connection
- Check Nominatim API is accessible

### Manual input not working
- Ensure input field is visible
- Check browser console for errors
- Verify localStorage is enabled

### Location not persisting
- Check localStorage is enabled
- Check browser privacy settings
- Clear browser cache and try again

### Nominatim API errors
- API might be rate limited (1 req/sec)
- Try again after a few seconds
- Check internet connection

## Next Steps

1. ✅ Choose Option 1 (React) or Option 2 (Vanilla JS)
2. ✅ Add location element to navbar
3. ✅ Test location detection
4. ✅ Verify data in localStorage
5. ✅ Use location data for filtering nearby shops

## Using Location for Filtering

Once location is saved, you can use it to filter nearby shops:

```javascript
// Get user location
const userLat = localStorage.getItem('smartfetch_lat')
const userLon = localStorage.getItem('smartfetch_lon')

// Calculate distance to shops
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// Filter shops within 5km
const nearbyShops = shops.filter(shop => {
  const distance = getDistance(userLat, userLon, shop.lat, shop.lon)
  return distance <= 5
})
```

---

**Status**: Location detection ready to integrate ✅

Choose Option 1 (React) or Option 2 (Vanilla JS) and follow the steps above.
