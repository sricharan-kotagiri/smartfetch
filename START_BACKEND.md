# Quick Start: Running the Backend

## 🚀 Get Backend Running in 2 Minutes

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

You should see:
```
Server running on http://localhost:5000
Environment: development
Supabase URL: https://sxghctohznlmuuyzyaut.supabase.co
```

### Step 3: Test Health Check
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-03-28T..."
}
```

---

## ✅ Backend is Running!

### What's Available

**34 API Endpoints** across 7 categories:
- Authentication (8 endpoints)
- Shops (5 endpoints)
- Products (6 endpoints)
- Orders (5 endpoints)
- Cart (5 endpoints)
- Messages (3 endpoints)
- Customers (2 endpoints)

### Quick Test: Register Customer
```bash
curl -X POST http://localhost:5000/api/auth/register-customer \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!",
    "full_name": "Test User",
    "phone": "+1234567890"
  }'
```

---

## 📚 Full Testing Guide

See `BACKEND_TESTING_GUIDE.md` for complete curl examples for all 34 endpoints.

---

## 🔧 Troubleshooting

### Port 5000 Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>
```

### Dependencies Not Installing
```bash
# Clear npm cache
npm cache clean --force

# Reinstall
rm -rf node_modules package-lock.json
npm install
```

### Supabase Connection Error
- Check `.env` file has correct credentials
- Verify Supabase project is active
- Check internet connection

---

## 📝 Environment Variables

Backend uses these from `backend/.env`:
```
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3003
SUPABASE_URL=https://sxghctohznlmuuyzyaut.supabase.co
SUPABASE_ANON_KEY=sb_publishable_-2RkCH2acDi9UYlZ7F2Pcw_y8jWLHml
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

All configured and ready to go!

---

## 🎯 Next Steps

1. **Test Endpoints** - See `BACKEND_TESTING_GUIDE.md`
2. **Start Frontend** - `cd frontend && npm run dev`
3. **Test Full Flow** - Register, login, create order, etc.
4. **Deploy** - Build and deploy to production

---

## 📞 Need Help?

- Check logs in terminal for errors
- See `BACKEND_API_COMPLETE.md` for full API reference
- See `BACKEND_TESTING_GUIDE.md` for testing examples
- See `TASK_4_COMPLETE.md` for implementation details

---

**Backend Ready!** 🚀
