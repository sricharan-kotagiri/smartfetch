# SmartFetch Quick Reference

Fast lookup for common tasks and commands.

## Start Development

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev

# Open browser
http://localhost:3000
```

## Supabase Credentials

```
Project URL: https://sxghctohznlmuuyzyaut.supabase.co
Database: PostgreSQL
Status: Active
```

## Backend Environment

```env
SUPABASE_URL=https://sxghctohznlmuuyzyaut.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
JWT_SECRET=random_secret
PORT=5000
```

## Frontend Environment

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
VITE_SUPABASE_URL=https://sxghctohznlmuuyzyaut.supabase.co
```

## API Endpoints

### Authentication
```
POST /api/auth/send-otp
POST /api/auth/verify-otp
POST /api/auth/resend-otp
POST /api/auth/logout
```

### Users
```
GET /api/users/profile/:userId
PUT /api/users/profile/:userId
GET /api/users/all
GET /api/users/search?q=query
```

## Test Commands

```bash
# Health check
curl http://localhost:5000/health

# Send OTP
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Verify OTP
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"123456"}'
```

## Database Tables

- users - Customer data
- shops - Store information
- products - Product catalog
- orders - Customer orders
- order_items - Order line items
- otp_codes - OTP management

## Key Files

### Backend
- `backend/src/server.ts` - Main server
- `backend/src/services/database.service.ts` - Database operations
- `backend/src/routes/auth.routes.ts` - Auth endpoints
- `backend/src/routes/user.routes.ts` - User endpoints

### Frontend
- `frontend/src/services/auth.service.ts` - Auth API calls
- `frontend/src/hooks/useAuth.ts` - Auth hook
- `components/auth-screen-backend.tsx` - Login component

## Documentation

- **README.md** - Overview
- **QUICKSTART.md** - 5-minute setup
- **SUPABASE_SETUP.md** - Supabase configuration
- **CUSTOMER_DATA_GUIDE.md** - Customer data management
- **TROUBLESHOOTING.md** - Common issues
- **INTEGRATION_GUIDE.md** - Architecture

## Common Tasks

### Add Customer
1. Frontend: Enter email/phone
2. Click "Send OTP"
3. Enter OTP
4. Click "Verify"
5. Customer created in Supabase

### View Customers
1. Go to https://sxghctohznlmuuyzyaut.supabase.co
2. Click "Table Editor"
3. Select "users" table
4. View all customers

### Update Customer
```bash
curl -X PUT http://localhost:5000/api/users/profile/user-id \
  -H "Content-Type: application/json" \
  -d '{"full_name":"New Name","phone":"+919876543210"}'
```

### Search Customers
```bash
curl http://localhost:5000/api/users/search?q=john
```

## Troubleshooting

### Backend won't start
```bash
cd backend
rm -rf node_modules
npm install
npm run dev
```

### Email not sending
- Check Gmail app password (16 chars)
- Verify 2FA is enabled
- Check EMAIL_USER in .env

### Frontend can't connect
- Verify backend is running
- Check NEXT_PUBLIC_API_URL
- Check browser console

### Customer data not saving
- Check Supabase connection
- Verify database tables exist
- Check backend logs

## Ports

- Backend: 5000
- Frontend: 3000
- Supabase: https://sxghctohznlmuuyzyaut.supabase.co

## Credentials

### Gmail
- Email: your_email@gmail.com
- Password: 16-character app password

### Supabase
- URL: https://sxghctohznlmuuyzyaut.supabase.co
- Service Role Key: In .env

### JWT
- Secret: In .env
- Expiry: 7 days

## Features

✅ Email OTP login
✅ Phone OTP login
✅ Customer registration
✅ Customer data storage
✅ Profile management
✅ JWT authentication
✅ Rate limiting
✅ Error handling

## Status

✅ Backend: Ready
✅ Frontend: Ready
✅ Database: Connected
✅ Email: Configured
✅ Authentication: Working

## Next Steps

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Open http://localhost:3000
4. Test customer registration
5. Verify data in Supabase
6. Deploy to production

---

**Quick Start**: `npm run dev` in both backend and frontend directories
