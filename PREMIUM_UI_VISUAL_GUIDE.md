# SmartFetch Premium UI - Visual Guide

## 🎨 Color Palette

### Primary Colors
```
Electric Blue:    #3B82F6  ████████████████████
Cyan Accent:      #06B6D4  ████████████████████
```

### Dark Backgrounds
```
Base (Darkest):   #060912  ████████████████████
Surface:          #0C1120  ████████████████████
Card:             #111827  ████████████████████
Input:            #0F1829  ████████████████████
```

### Text Colors
```
White:            #F9FAFB  ████████████████████
Gray:             #9CA3AF  ████████████████████
Muted:            #4B5563  ████████████████████
```

### Accent Colors
```
Purple:           #8B5CF6  ████████████████████
Pink:             #EC4899  ████████████████████
Orange:           #F59E0B  ████████████████████
Green:            #10B981  ████████████████████
Red:              #EF4444  ████████████████████
```

---

## 📐 Component Styles

### Buttons

#### Primary Button (Blue Gradient)
```
Background: linear-gradient(135deg, #3B82F6, #2563EB)
Padding: 14px 28px
Border Radius: 14px
Color: #fff
Font Weight: 700
Box Shadow: 0 8px 28px rgba(59,130,246,0.4)
Hover: translateY(-2px), shadow increases
```

#### Secondary Button (Ghost)
```
Background: rgba(255,255,255,0.06)
Border: 1px solid rgba(255,255,255,0.12)
Padding: 14px 28px
Border Radius: 14px
Color: #E5E7EB
Font Weight: 600
Hover: background increases, border brightens
```

#### Danger Button (Red)
```
Background: rgba(239,68,68,0.1)
Border: 1px solid rgba(239,68,68,0.2)
Color: #FCA5A5
Font Weight: 700
Hover: background increases
```

### Input Fields
```
Background: #0F1829
Border: 1px solid rgba(255,255,255,0.06)
Border Radius: 12px
Padding: 12px 16px
Color: #F9FAFB
Font: Inter, sans-serif
Focus: Border #3B82F6, Box Shadow 0 0 0 3px rgba(59,130,246,0.15)
```

### Cards
```
Background: #0C1120
Border: 1px solid rgba(255,255,255,0.06)
Border Radius: 20px
Padding: 24px
Hover: 
  - Background: #111827
  - Border: rgba(59,130,246,0.25)
  - Transform: translateY(-4px)
  - Box Shadow: 0 16px 40px rgba(0,0,0,0.4)
```

### Badges
```
Background: rgba(59,130,246,0.15)
Border: 1px solid rgba(59,130,246,0.25)
Border Radius: 99px
Padding: 6px 14px
Color: #60A5FA
Font Size: 0.78rem
Font Weight: 600
```

---

## 🏗️ Layout Components

### Navbar
```
Height: 60px
Position: sticky, top: 0
Background: rgba(6,9,18,0.7) → rgba(6,9,18,0.95) on scroll
Backdrop Filter: blur(20px)
Border Bottom: 1px solid rgba(255,255,255,0.06) on scroll
Display: flex, justify-content: space-between
```

### Bottom Navigation
```
Position: fixed, bottom: 0
Height: auto (with padding)
Background: rgba(6,9,18,0.97)
Backdrop Filter: blur(24px)
Border Top: 1px solid rgba(255,255,255,0.06)
Display: flex, justify-content: space-around
```

### Sidebar (Dashboard)
```
Width: 220px
Position: fixed, left: 0
Background: #060912
Border Right: 1px solid rgba(255,255,255,0.05)
Display: flex, flex-direction: column
```

### Hero Section
```
Min Height: calc(100vh - 60px)
Display: flex, align-items: center
Padding: 4rem 1.5rem
Position: relative
Grid: 2 columns (1fr 1fr) on desktop
Gap: 60px
```

---

## ✨ Animation Effects

### Fade Up
```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
Duration: 0.6s
Timing: ease
```

### Float
```css
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
Duration: 6s
Timing: ease-in-out
Iteration: infinite
```

### Glow Pulse
```css
@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 20px rgba(59,130,246,0.3); }
  50% { box-shadow: 0 0 40px rgba(59,130,246,0.6); }
}
Duration: 2s
Iteration: infinite
```

---

## 🎯 Typography

### Font Family
```
Primary: 'Inter', -apple-system, sans-serif
Fallback: System fonts
```

### Font Sizes
```
H1: clamp(2.5rem, 5vw, 4.5rem)
H2: clamp(1.75rem, 4vw, 2.5rem)
H3: 1rem
Body: 0.875rem - 1rem
Small: 0.78rem - 0.8rem
Tiny: 0.65rem - 0.72rem
```

### Font Weights
```
Headings: 900
Subheadings: 700
Body: 500
Labels: 600
Muted: 400
```

### Letter Spacing
```
Headings: -0.03em to -0.04em
Labels: 0.04em to 0.12em
Normal: 0
```

---

## 🌈 Gradient Examples

### Blue Gradient (Primary)
```
linear-gradient(135deg, #3B82F6, #2563EB)
```

### Blue to Cyan (Text)
```
linear-gradient(135deg, #3B82F6, #06B6D4)
WebkitBackgroundClip: text
WebkitTextFillColor: transparent
```

### Dark Gradient (Background)
```
linear-gradient(180deg, #060912 0%, #0C1120 100%)
```

### Radial Glow (Background Effect)
```
radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 65%)
```

---

## 📱 Responsive Design

### Mobile First
```
Base: Mobile (< 768px)
Tablet: 768px - 1024px
Desktop: > 1024px
```

### Grid Layouts
```
Landing Hero: 1 column (mobile) → 2 columns (desktop)
Features: 1 column → 2 columns → 3 columns
Shop Cards: 1 column → 2 columns → 3 columns
```

### Spacing
```
Mobile: 1.5rem padding
Tablet: 2rem padding
Desktop: 2rem padding
Max Width: 1100px
```

---

## 🔍 Hover States

### Button Hover
```
Transform: translateY(-2px)
Opacity: 0.9
Box Shadow: Increases
```

### Card Hover
```
Background: Brightens
Border Color: Blue accent
Transform: translateY(-4px)
Box Shadow: 0 16px 40px rgba(0,0,0,0.4)
```

### Input Focus
```
Border Color: #3B82F6
Box Shadow: 0 0 0 3px rgba(59,130,246,0.15)
Background: Slightly brighter
```

---

## 🎨 Component Examples

### Feature Card
```
Background: #0C1120
Border: 1px solid rgba(255,255,255,0.06)
Border Radius: 20px
Padding: 24px
Icon: 46px × 46px, colored background
Title: #F9FAFB, fontWeight 700
Description: #6B7280, fontSize 0.875rem
```

### Shop Card
```
Display: flex
Background: #0C1120
Border Radius: 16px
Image: 88px × 88px (left side)
Details: flex 1 (right side)
Name: #F9FAFB, fontWeight 700
Category: #6B7280, fontSize 0.78rem
Time Badge: Blue background, #60A5FA text
```

### Category Chip
```
Padding: 8px 16px
Border Radius: 99px
Font Size: 0.82rem
Active: Blue gradient background, white text
Inactive: rgba(255,255,255,0.05), #9CA3AF text
```

---

## 🚀 Performance Tips

1. **Use CSS Variables** for consistent theming
2. **Inline Styles** for component-specific styling
3. **GPU Acceleration** for animations (transform, opacity)
4. **Backdrop Filter** for glass effects (use sparingly)
5. **Lazy Load** images in shop cards
6. **Debounce** search input
7. **Memoize** components to prevent re-renders

---

## 📋 Accessibility

- ✅ Sufficient color contrast (WCAG AA)
- ✅ Focus states on all interactive elements
- ✅ Semantic HTML structure
- ✅ Keyboard navigation support
- ✅ Screen reader friendly
- ✅ Mobile touch targets (min 44px)

---

## 🎯 Design Tokens

```javascript
const tokens = {
  colors: {
    primary: '#3B82F6',
    secondary: '#06B6D4',
    background: '#060912',
    surface: '#0C1120',
    card: '#111827',
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    textMuted: '#4B5563',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
  },
  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    full: '999px',
  },
  shadows: {
    sm: '0 4px 14px rgba(59,130,246,0.4)',
    md: '0 8px 28px rgba(59,130,246,0.4)',
    lg: '0 16px 40px rgba(0,0,0,0.4)',
  },
}
```

---

**Last Updated**: April 20, 2026
**Status**: ✅ Complete and Ready for Implementation
