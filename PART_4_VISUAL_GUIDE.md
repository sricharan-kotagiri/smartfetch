# Part 4 — Visual Guide 🎨

## Component Layouts

### 1. QR Scanner Page (`/dashboard/scanner`)

```
┌─────────────────────────────────────────┐
│  📷 QR Scanner                          │
│  Scan customer's order QR code...       │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│                                         │
│         [Camera Feed Area]              │
│                                         │
│    Point camera at customer's           │
│    order QR code                        │
│                                         │
└─────────────────────────────────────────┘

                    ↓ (After Scan)

┌─────────────────────────────────────────┐
│  🧾 Order Receipt                       │
│  SmartFetch                             │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  PICKUP CODE                    │   │
│  │  SF-DEM01                       │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Customer: John Doe    Shop: Ravi's    │
│  Pickup: 3:30 PM       Payment: UPI    │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Item        Qty    Price        │   │
│  ├─────────────────────────────────┤   │
│  │ Biryani     ×2     ₹240         │   │
│  │ Dosa        ×1     ₹60          │   │
│  ├─────────────────────────────────┤   │
│  │ TOTAL              ₹300         │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [Scan Again]  [✓ Mark as Picked Up]   │
│                                         │
└─────────────────────────────────────────┘

                    ↓ (After Mark)

┌─────────────────────────────────────────┐
│              ✅                         │
│  Order Picked Up!                       │
│  Order #SF-DEM01 marked as picked up    │
│                                         │
│  [Scan Next Order]                      │
└─────────────────────────────────────────┘
```

---

### 2. Receipt Component

```
┌──────────────────────────────────────────┐
│ 🛍️ SmartFetch          📅 18 Apr 2026   │
│ Order Receipt          ⏰ 3:30 PM        │
├──────────────────────────────────────────┤
│                                          │
│ Order ID: #DEM00001                      │
│                                          │
│ ┌────────────────────────────────────┐  │
│ │ PICKUP CODE                        │  │
│ │ SF-DEM01                           │  │
│ └────────────────────────────────────┘  │
│                                          │
│ Customer: John Doe                       │
│ Shop: Ravi's Kitchen                     │
│ Shopkeeper: Ravi Kumar                   │
│ Pickup Time: 3:30 PM                     │
│ Payment: UPI                             │
│                                          │
│ ┌────────────────────────────────────┐  │
│ │ Item          Qty    Price         │  │
│ ├────────────────────────────────────┤  │
│ │ Biryani       ×2     ₹240          │  │
│ │ Dosa          ×1     ₹60           │  │
│ ├────────────────────────────────────┤  │
│ │ TOTAL                ₹300          │  │
│ └────────────────────────────────────┘  │
│                                          │
│ ┌────────────────────────────────────┐  │
│ │                                    │  │
│ │        [QR Code Here]              │  │
│ │        (160x160)                   │  │
│ │                                    │  │
│ │  Show this QR code at pickup       │  │
│ │  Scan QR to verify order           │  │
│ │                                    │  │
│ └────────────────────────────────────┘  │
│                                          │
│ Thank you for using SmartFetch! 🛍️      │
│                                          │
└──────────────────────────────────────────┘

[📥 Download Receipt]
```

---

### 3. Customer Profile Page (`/profile`)

```
┌─────────────────────────────────────────┐
│ Navbar with Profile Icon (👤)           │
├─────────────────────────────────────────┤
│                                         │
│              ┌─────────┐                │
│              │    👤   │                │
│              │ (Avatar)│                │
│              └─────────┘                │
│                                         │
│         John Doe                        │
│         john@example.com                │
│                                         │
├─────────────────────────────────────────┤
│ Edit Profile                            │
│                                         │
│ Full Name: [John Doe          ]         │
│ Phone:     [9876543210        ]         │
│                                         │
│ ✅ Profile saved!                       │
│                                         │
│ [Save Changes]                          │
│                                         │
├─────────────────────────────────────────┤
│ 📋 My Orders                      →     │
│ 🔒 Privacy Policy                 →     │
│ 📄 Terms & Conditions             →     │
│                                         │
├─────────────────────────────────────────┤
│ [🚪 Logout]                             │
│ [🗑️ Delete Account]                     │
│                                         │
└─────────────────────────────────────────┘

                    ↓ (Delete Click)

┌─────────────────────────────────────────┐
│              ⚠️                         │
│  Delete Account?                        │
│                                         │
│  This will permanently delete your      │
│  account and all order history.         │
│  This cannot be undone.                 │
│                                         │
│  [Delete Forever]                       │
│  [Cancel]                               │
│                                         │
└─────────────────────────────────────────┘
```

---

### 4. Navbar with Profile Icon

```
Desktop View:
┌──────────────────────────────────────────────────────────┐
│ [Logo] SmartFetch    Home    [👤]    [Logout]  [🌙]      │
└──────────────────────────────────────────────────────────┘

Mobile View:
┌──────────────────────────────────────────────────────────┐
│ [Logo]                                    [🌙]  [☰]      │
└──────────────────────────────────────────────────────────┘

Mobile Menu (Open):
┌──────────────────────────────────────────────────────────┐
│ Home                                                      │
│ 👤 Profile                                                │
│ 🚪 Logout                                                 │
└──────────────────────────────────────────────────────────┘
```

---

## Color Scheme

```
Primary Colors:
┌─────────────────────────────────────────┐
│ Primary Green:    #10B981 ███████████   │
│ Secondary Green:  #059669 ███████████   │
│ Dark Background:  #0A0F1E ███████████   │
│ Card Background:  #0D1424 ███████████   │
│ Receipt BG:       #FFFBF0 ███████████   │
└─────────────────────────────────────────┘

Text Colors:
┌─────────────────────────────────────────┐
│ Primary Text:     #FFFFFF ███████████   │
│ Secondary Text:   #94A3B8 ███████████   │
│ Muted Text:       #6B7280 ███████████   │
│ Error:            #EF4444 ███████████   │
└─────────────────────────────────────────┘
```

---

## Typography

```
Headers (Syne Font):
┌─────────────────────────────────────────┐
│ H1: 1.75rem, Weight 800                 │
│ H2: 1.5rem, Weight 800                  │
│ H3: 1.25rem, Weight 700                 │
└─────────────────────────────────────────┘

Body (DM Sans Font):
┌─────────────────────────────────────────┐
│ Regular: 1rem, Weight 500                │
│ Small: 0.875rem, Weight 500              │
│ Tiny: 0.75rem, Weight 500                │
│ Bold: Any size, Weight 700               │
└─────────────────────────────────────────┘

Monospace (Monospace Font):
┌─────────────────────────────────────────┐
│ Pickup Code: 2rem, Weight 900            │
│ Order ID: 0.8rem, Weight 700             │
└─────────────────────────────────────────┘
```

---

## Spacing System

```
Padding:
┌─────────────────────────────────────────┐
│ Large:   1.5rem (24px)                  │
│ Medium:  1rem (16px)                    │
│ Small:   0.75rem (12px)                 │
│ Tiny:    0.5rem (8px)                   │
└─────────────────────────────────────────┘

Gaps:
┌─────────────────────────────────────────┐
│ Large:   1rem (16px)                    │
│ Medium:  0.75rem (12px)                 │
│ Small:   0.5rem (8px)                   │
└─────────────────────────────────────────┘

Margins:
┌─────────────────────────────────────────┐
│ Large:   2rem (32px)                    │
│ Medium:  1.5rem (24px)                  │
│ Small:   1rem (16px)                    │
└─────────────────────────────────────────┘
```

---

## Border Radius

```
Components:
┌─────────────────────────────────────────┐
│ Cards:        20px (rounded-lg)         │
│ Buttons:      12px (rounded-md)         │
│ Inputs:       12px (rounded-md)         │
│ Avatar:       50% (rounded-full)        │
│ QR Code Box:  12px (rounded-md)         │
└─────────────────────────────────────────┘
```

---

## Shadows

```
Elevation Levels:
┌─────────────────────────────────────────┐
│ Level 1: 0 4px 12px rgba(...)           │
│ Level 2: 0 4px 15px rgba(...)           │
│ Level 3: 0 8px 32px rgba(...)           │
│ Level 4: 0 10px 40px rgba(...)          │
└─────────────────────────────────────────┘
```

---

## Responsive Breakpoints

```
Mobile First:
┌─────────────────────────────────────────┐
│ Mobile:   < 640px                       │
│ Tablet:   640px - 1024px                │
│ Desktop:  > 1024px                      │
└─────────────────────────────────────────┘

Layout Changes:
┌─────────────────────────────────────────┐
│ Mobile:   Single column, full width     │
│ Tablet:   2 columns, 90% width          │
│ Desktop:  3 columns, max-width 1200px   │
└─────────────────────────────────────────┘
```

---

## Animation & Transitions

```
Hover Effects:
┌─────────────────────────────────────────┐
│ Buttons:      0.2s ease                 │
│ Links:        0.2s ease                 │
│ Cards:        0.2s ease                 │
│ Icons:        0.2s ease                 │
└─────────────────────────────────────────┘

State Changes:
┌─────────────────────────────────────────┐
│ Loading:      Opacity fade              │
│ Success:      Slide in from top          │
│ Error:        Shake animation            │
│ Modal:        Fade in/out                │
└─────────────────────────────────────────┘
```

---

## User Flow Diagrams

### Scanner Flow
```
Shopkeeper Dashboard
        ↓
    Scanner Page
        ↓
  Camera Opens
        ↓
  Scan QR Code
        ↓
  Order Details Show
        ↓
  Mark as Picked Up
        ↓
  Success Message
        ↓
  Scan Again or Back
```

### Receipt Flow
```
Customer Order
        ↓
  View Receipt
        ↓
  See QR Code
        ↓
  Download PNG
        ↓
  Share/Print
```

### Profile Flow
```
Customer Dashboard
        ↓
  Click Profile Icon
        ↓
  View Profile
        ↓
  Edit Profile
        ↓
  Save Changes
        ↓
  Success Message
```

---

## Accessibility Features

```
Color Contrast:
┌─────────────────────────────────────────┐
│ Text on Dark:     WCAG AAA (7:1+)       │
│ Text on Light:    WCAG AAA (7:1+)       │
│ Buttons:          WCAG AA (4.5:1+)      │
└─────────────────────────────────────────┘

Touch Targets:
┌─────────────────────────────────────────┐
│ Minimum Size:     44x44px                │
│ Buttons:          48x48px                │
│ Links:            44x44px                │
│ Icons:            38x38px                │
└─────────────────────────────────────────┘

Keyboard Navigation:
┌─────────────────────────────────────────┐
│ Tab Order:        Logical flow           │
│ Focus Visible:    Clear outline          │
│ Escape Key:       Close modals           │
│ Enter Key:        Submit forms           │
└─────────────────────────────────────────┘
```

---

## Mobile Optimization

```
Screen Sizes:
┌─────────────────────────────────────────┐
│ iPhone SE:        375px                 │
│ iPhone 12:        390px                 │
│ iPhone 14 Pro:    430px                 │
│ iPad Mini:        768px                 │
│ iPad Pro:         1024px                │
└─────────────────────────────────────────┘

Touch Friendly:
┌─────────────────────────────────────────┐
│ Button Size:      48x48px minimum       │
│ Spacing:          12px between items    │
│ Font Size:        16px minimum          │
│ Line Height:      1.5 for readability   │
└─────────────────────────────────────────┘
```

---

## Dark Mode Support

```
Current Implementation:
┌─────────────────────────────────────────┐
│ Background:       #0A0F1E (Dark)        │
│ Cards:            #0D1424 (Darker)      │
│ Text:             #FFFFFF (Light)       │
│ Accents:          #10B981 (Green)       │
│ Borders:          rgba(255,255,255,0.1)│
└─────────────────────────────────────────┘

No Light Mode Needed:
✅ All components designed for dark theme
✅ High contrast for readability
✅ Emerald accents pop on dark background
```

---

**Visual design is complete and consistent! 🎨**
