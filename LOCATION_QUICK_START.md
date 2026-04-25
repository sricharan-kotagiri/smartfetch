# Location Detection - Quick Start

Get location detection working in 2 minutes.

## Choose Your Method

### Method 1: React Component (Recommended for Next.js)

**Step 1: Open your navbar component**
```
components/app-header.tsx
or
components/navbar.tsx
or wherever your navbar is
```

**Step 2: Add import**
```tsx
import { LocationDetector } from '@/components/LocationDetector'
```

**Step 3: Add to navbar JSX**
```tsx
<nav className="navbar">
  <div className="navbar-content">
    <h1>SmartFetch</h1>
    
    {/* ADD THIS LINE */}
    <LocationDetector />
    
    <button>Login</button>
  </div>
</nav>
```

**Step 4: Done!** ✅
- Location auto-detects on page load
- Shows "📍 City, State" in navbar
- Click "Change" to update
- Data saved in localStorage

---

### Method 2: Vanilla JavaScript

**Step 1: Add script tag to your HTML**

Find your main HTML file and add this before `</body>`:
```html
<!-- Location Detection -->
<script src="/location.js"></script>
```

**Step 2: Add location element to navbar**

Find your navbar HTML and add this:
```html
<div id="user-location"></div>
```

Example navbar:
```html
<nav class="navbar">
  <div class="navbar-container">
    <h1>SmartFetch</h1>
    
    <!-- ADD THIS -->
    <div id="user-location"></div>
    
    <button>Login</button>
  </div>
</nav>
```

**Step 3: Done!** ✅
- Location auto-detects on page load
- Shows "📍 City, State" in navbar
- Click "Change" to update
- Data saved in localStorage

---

## What Happens

### On First Visit
1. Browser asks for location permission
2. User clicks "Allow"
3. Location detected and shown in navbar
4. Data saved in localStorage

### On Refresh
1. Location retrieved from localStorage
2. Shown immediately in navbar
3. No permission request

### Click "Change"
1. localStorage cleared
2. Browser asks for permission again
3. New location detected
4. Data updated

### Permission Denied
1. Manual input field appears
2. User types city name
3. Clicks "Set" or presses Enter
4. Location saved and displayed

---

## Test It

### Test 1: First Visit
```
1. Open http://localhost:3000
2. Browser asks for location permission
3. Click "Allow"
4. Location appears in navbar
5. Refresh page - location still shows
```

### Test 2: Check Data
```
1. Open DevTools (F12)
2. Go to Application → Local Storage
3. Look for:
   - smartfetch_location = "City, State"
   - smartfetch_lat = "17.3850"
   - smartfetch_lon = "78.4867"
```

### Test 3: Change Location
```
1. Click "Change" button
2. Browser asks for permission
3. Click "Allow"
4. New location appears
```

---

## Access Location Data

### In React
```tsx
// Get location from localStorage
const location = localStorage.getItem('smartfetch_location')
const lat = localStorage.getItem('smartfetch_lat')
const lon = localStorage.getItem('smartfetch_lon')

// Use in your code
console.log(`User is in ${location}`)
```

### In JavaScript
```javascript
// Get all data
const data = window.locationManager.getAllLocationData()
// { location: "City, State", latitude: 17.3850, longitude: 78.4867 }

// Or get individual values
const city = window.locationManager.getSavedLocation()
const lat = window.locationManager.getSavedLatitude()
const lon = window.locationManager.getSavedLongitude()
```

---

## Files Created

1. **frontend/public/location.js** - Vanilla JS (500+ lines)
2. **frontend/src/components/LocationDetector.tsx** - React component
3. **LOCATION_SETUP.md** - Detailed guide
4. **LOCATION_DETECTION_COMPLETE.md** - Full documentation
5. **LOCATION_QUICK_START.md** - This file

---

## Troubleshooting

### Location not showing
- Check browser allows geolocation
- Check internet connection
- Check browser console for errors
- Try in a different browser

### Manual input not working
- Make sure you typed a city name
- Press Enter or click "Set"
- Check browser console

### Data not saving
- Check localStorage is enabled
- Check browser privacy settings
- Try clearing cache

---

## Next Steps

1. ✅ Choose Method 1 or Method 2
2. ✅ Add location to navbar
3. ✅ Test location detection
4. ✅ Verify data in localStorage
5. ✅ Use location for filtering nearby shops

---

**That's it!** Location detection is now working. 🎉

For detailed information, see LOCATION_SETUP.md
