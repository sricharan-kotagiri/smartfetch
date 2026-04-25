# Part 4 — Commands Reference 🔧

## Quick Commands

### Start Development
```bash
cd frontend
npm run dev
```

### Build for Production
```bash
cd frontend
npm run build
```

### Type Check
```bash
cd frontend
npm run type-check
```

### Lint Code
```bash
cd frontend
npm run lint
```

---

## Testing Commands

### Test Scanner Page
```bash
# 1. Start dev server
npm run dev

# 2. Open browser to http://localhost:5173
# 3. Login as shopkeeper
# 4. Navigate to /dashboard/scanner
# 5. Generate QR code from customer receipt
# 6. Scan with camera
# 7. Verify order details appear
# 8. Click "Mark as Picked Up"
# 9. Verify success message
```

### Test Receipt Component
```bash
# 1. Start dev server
npm run dev

# 2. Open browser to http://localhost:5173
# 3. Login as customer
# 4. Navigate to /orders or /profile
# 5. View order receipt
# 6. Verify QR code displays
# 7. Click "Download Receipt"
# 8. Verify PNG file downloads
```

### Test Profile Page
```bash
# 1. Start dev server
npm run dev

# 2. Open browser to http://localhost:5173
# 3. Login as customer
# 4. Click profile icon (👤) in navbar
# 5. Verify profile loads
# 6. Edit name and phone
# 7. Click "Save Changes"
# 8. Verify success message
# 9. Test logout
# 10. Test delete account
```

### Test Navbar Icon
```bash
# 1. Start dev server
npm run dev

# 2. Open browser to http://localhost:5173
# 3. Login as customer
# 4. Verify profile icon (👤) shows in navbar
# 5. Click profile icon
# 6. Verify navigation to /profile
# 7. Test on mobile (resize browser)
# 8. Verify mobile menu works
```

---

## Verification Commands

### Check TypeScript Errors
```bash
cd frontend
npm run type-check
```

### Check Lint Errors
```bash
cd frontend
npm run lint
```

### Build Check
```bash
cd frontend
npm run build
```

### Full Verification
```bash
cd frontend
npm run type-check && npm run lint && npm run build
```

---

## Development Workflow

### 1. Setup
```bash
cd frontend
npm install
```

### 2. Start Dev Server
```bash
npm run dev
```

### 3. Make Changes
```bash
# Edit files in src/
# Changes auto-reload in browser
```

### 4. Test Changes
```bash
# Test in browser at http://localhost:5173
# Check browser console for errors
# Verify functionality
```

### 5. Build for Production
```bash
npm run build
```

### 6. Deploy
```bash
# Deploy dist/ folder to hosting
# Test in production environment
```

---

## Debugging Commands

### Check Browser Console
```bash
# Open DevTools: F12 or Ctrl+Shift+I
# Go to Console tab
# Look for errors or warnings
```

### Check Network Requests
```bash
# Open DevTools: F12 or Ctrl+Shift+I
# Go to Network tab
# Reload page
# Check for failed requests
# Verify Supabase calls
```

### Check Application State
```bash
# Open DevTools: F12 or Ctrl+Shift+I
# Go to Application tab
# Check localStorage
# Check sessionStorage
# Check cookies
```

### Check Performance
```bash
# Open DevTools: F12 or Ctrl+Shift+I
# Go to Performance tab
# Record page load
# Analyze performance metrics
```

---

## Git Commands

### Check Status
```bash
git status
```

### View Changes
```bash
git diff
```

### Stage Changes
```bash
git add frontend/src/pages/scanner.tsx
git add frontend/src/components/Receipt.tsx
git add frontend/src/components/Navbar.tsx
git add frontend/src/pages/demo.tsx
git add frontend/src/pages/order-detail.tsx
```

### Commit Changes
```bash
git commit -m "Part 4: Add QR Scanner, Receipt, and Profile"
```

### Push Changes
```bash
git push origin main
```

---

## Environment Setup

### Check Node Version
```bash
node --version
# Should be 16+ or 18+
```

### Check npm Version
```bash
npm --version
# Should be 8+
```

### Install Dependencies
```bash
cd frontend
npm install
```

### Verify Installation
```bash
npm list html5-qrcode
npm list qrcode.react
npm list html2canvas
```

---

## Troubleshooting Commands

### Clear npm Cache
```bash
npm cache clean --force
```

### Reinstall Dependencies
```bash
cd frontend
rm -rf node_modules
npm install
```

### Clear Build Cache
```bash
cd frontend
rm -rf dist
npm run build
```

### Reset to Clean State
```bash
cd frontend
rm -rf node_modules dist
npm install
npm run build
```

---

## Production Deployment

### Build for Production
```bash
cd frontend
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to Hosting
```bash
# Option 1: Manual deployment
# Upload dist/ folder to hosting provider

# Option 2: GitHub Pages
npm run build
# Push dist/ to gh-pages branch

# Option 3: Vercel
vercel deploy

# Option 4: Netlify
netlify deploy --prod --dir=dist
```

---

## Monitoring Commands

### Check File Sizes
```bash
cd frontend
du -sh dist/
du -sh dist/assets/
```

### Check Build Time
```bash
cd frontend
time npm run build
```

### Check Dependencies
```bash
npm list
npm outdated
```

---

## Useful Shortcuts

### Quick Dev Start
```bash
cd frontend && npm run dev
```

### Quick Build
```bash
cd frontend && npm run build
```

### Quick Type Check
```bash
cd frontend && npm run type-check
```

### Quick Lint
```bash
cd frontend && npm run lint
```

### Full Check
```bash
cd frontend && npm run type-check && npm run lint && npm run build
```

---

## Browser DevTools Tips

### Inspect Element
```
Right-click → Inspect
or
Ctrl+Shift+C (Windows/Linux)
Cmd+Shift+C (Mac)
```

### Toggle Device Toolbar
```
Ctrl+Shift+M (Windows/Linux)
Cmd+Shift+M (Mac)
```

### Open Console
```
Ctrl+Shift+J (Windows/Linux)
Cmd+Shift+J (Mac)
```

### Open Network Tab
```
Ctrl+Shift+E (Windows/Linux)
Cmd+Shift+E (Mac)
```

### Open Application Tab
```
Ctrl+Shift+I → Application tab
Cmd+Shift+I → Application tab
```

---

## Common Issues & Fixes

### Issue: Port Already in Use
```bash
# Kill process on port 5173
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5173
kill -9 <PID>
```

### Issue: Module Not Found
```bash
# Reinstall dependencies
cd frontend
rm -rf node_modules
npm install
```

### Issue: Build Fails
```bash
# Clear cache and rebuild
cd frontend
npm cache clean --force
rm -rf dist
npm run build
```

### Issue: TypeScript Errors
```bash
# Run type check
npm run type-check

# Fix errors in code
# Rerun type check
npm run type-check
```

---

## Performance Optimization

### Analyze Bundle Size
```bash
# Install analyzer
npm install --save-dev vite-plugin-visualizer

# Add to vite.config.ts
import { visualizer } from 'vite-plugin-visualizer'

export default {
  plugins: [visualizer()]
}

# Build and view
npm run build
# Open dist/stats.html
```

### Check Performance
```bash
# Use Lighthouse in DevTools
# Ctrl+Shift+I → Lighthouse tab
# Run audit
# Review recommendations
```

---

## Documentation Commands

### View README
```bash
cat README.md
```

### View Part 4 Docs
```bash
cat PART_4_SCANNER_RECEIPT_PROFILE_COMPLETE.md
cat PART_4_QUICK_START.md
cat PART_4_VERIFICATION_CHECKLIST.md
cat PART_4_CODE_CHANGES_SUMMARY.md
cat PART_4_VISUAL_GUIDE.md
cat PART_4_FINAL_SUMMARY.md
cat PART_4_COMMANDS.md
```

---

## Useful Links

### Documentation
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [Vite Docs](https://vitejs.dev)
- [Supabase Docs](https://supabase.com/docs)

### Libraries
- [html5-qrcode](https://github.com/mebjas/html5-qrcode)
- [qrcode.react](https://github.com/davidcreate/react-qr-code)
- [html2canvas](https://html2canvas.hertzen.com)

### Tools
- [VS Code](https://code.visualstudio.com)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools)
- [Postman](https://www.postman.com)

---

## Quick Reference

### File Locations
```
Scanner:     frontend/src/pages/scanner.tsx
Receipt:     frontend/src/components/Receipt.tsx
Navbar:      frontend/src/components/Navbar.tsx
Profile:     frontend/src/pages/profile.tsx
App:         frontend/src/App.tsx
```

### Routes
```
Scanner:     /dashboard/scanner (shopkeeper)
Profile:     /profile (customer)
```

### Ports
```
Frontend:    http://localhost:5173
Backend:     http://localhost:3006
```

---

**All commands ready to use! 🚀**
