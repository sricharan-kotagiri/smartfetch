# 🎨 3D Parallax + Category Selection - Quick Start

## What's New?

### 1. 3D Parallax Background ✨
Move your mouse around any page and watch the background shift in 3D! Three layers move at different speeds creating depth.

**How it works:**
- Far layer (8px) - Gradient background
- Mid layer (15px) - Radial gradients
- Near layer (25px) - Dot pattern

### 2. Landing Page Hero Redesign 🏪
**Left side**: Logo, headline, CTA buttons
**Right side**: 3D floating shop card with shelves and products

Click "I'm a Customer" or "I'm a Shopkeeper" to see the category selection modal!

### 3. Category Selection Modal 🎯
Choose from 6 shop categories:
- 🛒 Supermarket
- 🍕 Food & Restaurant
- 💊 Pharmacy
- ⚡ Electronics
- 👕 Clothing
- 🏪 General Store

Selected category passes to signup URL for personalization.

## Files to Know

### New Components
- `frontend/src/components/ParallaxBackground.tsx` - Parallax effect
- `frontend/src/components/CategorySelection.tsx` - Category modal

### Updated Pages
- `landing.tsx` - New hero with 3D shop card
- `login.tsx` - Added parallax background
- `signup.tsx` - Added parallax background
- `verify-notice.tsx` - Added parallax background
- `verify-success.tsx` - Added parallax background
- `home.tsx` - Added parallax background
- `dashboard.tsx` - Added parallax background

### CSS Updates
- `frontend/src/index.css` - 3D shop card styles + animations

## Testing the Features

### Test Parallax
1. Open any page
2. Move your mouse around
3. Watch the background shift in 3D

### Test Category Selection
1. Go to landing page
2. Click "I'm a Customer" or "I'm a Shopkeeper"
3. Modal slides down with category cards
4. Click a category (see glow effect)
5. Click "Continue" to go to signup
6. Check URL for category parameter

### Test 3D Shop Card
1. Go to landing page on desktop
2. Look at right side - floating shop card
3. Watch it float up and down smoothly
4. See the 3D perspective effect

## Key Features

✅ Mouse-tracking parallax on all pages
✅ 3D shop card with CSS-only design
✅ Category selection before signup
✅ Smooth animations (60fps)
✅ Glassmorphism modal
✅ Responsive design
✅ Zero TypeScript errors
✅ No auth/routing changes

## Animation Details

### Parallax
- Smooth mouse tracking
- 3 layers with different speeds
- Automatic cleanup on unmount

### 3D Shop Card
- Floating animation (4s infinite)
- Perspective transform
- Colorful products on shelves
- Glowing ceiling lights

### Category Modal
- Slide-down entrance (0.4s)
- Hover scale + glow effect
- Smooth transitions

## Browser Support

Works on all modern browsers with:
- CSS 3D transforms
- CSS Grid/Flexbox
- CSS Variables
- Mouse events

## Performance

- GPU-accelerated transforms
- CSS-only animations
- No heavy JavaScript
- Smooth 60fps

---

**Ready to test?** Open the landing page and move your mouse! 🚀
