# 🚀 RUN SMARTFETCH NOW

## Copy & Paste These Commands

---

## TERMINAL 1 - Start Backend

```powershell
cd backend
npm install
node server.js
```

**Wait for this message:**
```
✓ Server running on http://localhost:3001
Ready to receive requests! 🚀
```

---

## TERMINAL 2 - Start Frontend

```powershell
cd frontend
npm install
npm run dev
```

**Wait for this message:**
```
✓ Ready in 2.5s
```

---

## BROWSER - Open Login Page

```
http://localhost:3000/login
```

---

## TEST - Complete Login Flow

1. Click **"Login with WhatsApp"**
2. Enter phone: **9876543210**
3. Click **"Get OTP"**
4. Enter OTP: **123456** (any 6 digits)
5. Click **"Verify OTP"**
6. See **"Login successful!"**
7. Verify you're logged in

---

## ✅ DONE!

Your WhatsApp OTP login is working! 🎉

---

## 📞 BACKEND ENDPOINTS

- **Send OTP**: `POST http://localhost:3001/send-otp`
- **Verify OTP**: `POST http://localhost:3001/verify-otp`
- **Health Check**: `GET http://localhost:3001/health`

---

## 🔧 IF SOMETHING GOES WRONG

### Backend won't install
```powershell
cd backend
rm -r node_modules
rm package-lock.json
npm cache clean --force
npm install
```

### Frontend won't install
```powershell
cd frontend
rm -r node_modules
rm package-lock.json
npm cache clean --force
npm install
```

### Port already in use
Kill the process and try again:
```powershell
# For port 3001
Get-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess | Stop-Process -Force

# For port 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force
```

---

## 📚 DOCUMENTATION

- `COMPLETE_SETUP_READY.md` - Full setup guide with troubleshooting
- `READY_TO_TEST.md` - Quick overview
- `RUN_NOW.md` - This file (quick commands)

---

**That's it! You're ready to go!** 🚀
