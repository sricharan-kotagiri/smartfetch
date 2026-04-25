# Access & Deployment Guide

## 🌐 Access Your Application

### Supabase Dashboard
**URL:** https://supabase.com/dashboard

**Your Project Details:**
- **Project URL:** https://sxghctohznlmuuyzyaut.supabase.co
- **Publishable Key:** sb_publishable_-2RkCH2acDi9UYlZ7F2Pcw_y8jWLHml

### Backend API
**Local Development:**
- **URL:** http://localhost:5000
- **Health Check:** http://localhost:5000/health

**API Endpoints:**
- Auth: `http://localhost:5000/api/auth`
- Shopkeepers: `http://localhost:5000/api/shopkeepers`
- Products: `http://localhost:5000/api/products`
- Orders: `http://localhost:5000/api/orders`

### Frontend Application
**Local Development:**
- **URL:** http://localhost:3000

## 📋 Setup Instructions

### Step 1: Database Setup

1. Go to Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to SQL Editor
4. Create new query
5. Copy entire contents of `supabase-complete-schema.sql`
6. Execute the query

This creates:
- All 6 tables (users, shopkeepers, products, orders, order_items, otp_logs)
- Indexes for performance
- Row Level Security (RLS) policies

### Step 2: Backend Configuration

1. Create `backend/.env` file:

```env
# Supabase
SUPABASE_URL=https://sxghctohznlmuuyzyaut.supabase.co
SUPABASE_ANON_KEY=sb_publishable_-2RkCH2acDi9UYlZ7F2Pcw_y8jWLHml
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Twilio (from previous setup)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_VERIFY_SERVICE_SID=your_verify_service_sid
TWILIO_WHATSAPP_NUMBER=whatsapp:+1234567890

# Server
PORT=5000
NODE_ENV=development
API_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000

# JWT
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRE=7d

# Redis
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=

# Logging
LOG_LEVEL=debug
```

2. Get Service Role Key:
   - Go to Supabase Dashboard
   - Settings → API
   - Copy "Service Role Key" (secret)
   - Paste in `.env` as `SUPABASE_SERVICE_ROLE_KEY`

### Step 3: Start Backend

```bash
cd backend
npm install
npm start
```

Expected output:
```
Server running on http://localhost:5000
Environment: development
Supabase URL: https://sxghctohznlmuuyzyaut.supabase.co
```

### Step 4: Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Expected output:
```
VITE v4.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
```

## 🧪 Testing the System

### Test 1: User Registration

```bash
# Send OTP
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "9876543210"}'

# Response:
# {
#   "success": true,
#   "message": "OTP sent successfully via WhatsApp",
#   "expiresIn": 300
# }
```

### Test 2: Verify OTP

```bash
# Verify OTP (use code from WhatsApp)
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "9876543210",
    "otp": "123456",
    "role": "customer"
  }'

# Response:
# {
#   "success": true,
#   "message": "Login successful",
#   "user": {
#     "id": "uuid",
#     "phone": "9876543210",
#     "full_name": "User",
#     "role": "customer"
#   },
#   "token": "jwt-token"
# }
```

### Test 3: Create Shop

```bash
# Create shop (use user_id from login response)
curl -X POST http://localhost:5000/api/shopkeepers/create-shop \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "uuid-from-login",
    "shop_name": "My Grocery Store",
    "owner_name": "John Doe",
    "upi_id": "john@upi",
    "location": "123 Main St",
    "latitude": 28.7041,
    "longitude": 77.1025
  }'
```

### Test 4: Add Product

```bash
# Add product (use user_id from login)
curl -X POST http://localhost:5000/api/products/add-product \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "uuid-from-login",
    "product_name": "Rice",
    "category": "grocery",
    "price": 50.00,
    "stock_quantity": 100,
    "description": "Premium basmati rice"
  }'
```

### Test 5: Create Order

```bash
# Create order (use customer user_id and product_id)
curl -X POST http://localhost:5000/api/orders/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "customer-uuid",
    "delivery_address": "123 Main St, City",
    "items": [
      {
        "product_id": "product-uuid",
        "quantity": 2
      }
    ]
  }'
```

## 📊 Database Verification

### Check Tables Created

Go to Supabase Dashboard → Table Editor

You should see:
- ✅ users
- ✅ shopkeepers
- ✅ products
- ✅ orders
- ✅ order_items
- ✅ otp_logs

### Check Data

```sql
-- View users
SELECT * FROM users;

-- View shopkeepers
SELECT * FROM shopkeepers;

-- View products
SELECT * FROM products;

-- View orders
SELECT * FROM orders;

-- View order items
SELECT * FROM order_items;

-- View OTP logs
SELECT * FROM otp_logs;
```

## 🚀 Production Deployment

### Before Deploying

- [ ] Test all endpoints locally
- [ ] Verify database schema
- [ ] Update environment variables
- [ ] Enable HTTPS
- [ ] Set strong JWT secret
- [ ] Configure CORS
- [ ] Enable RLS policies
- [ ] Set up monitoring
- [ ] Configure backups

### Deploy Backend

**Option 1: Heroku**

```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set SUPABASE_URL=your_url
heroku config:set SUPABASE_ANON_KEY=your_key
# ... set all other variables

# Deploy
git push heroku main
```

**Option 2: Railway**

```bash
# Install Railway CLI
# Login to Railway
railway login

# Deploy
railway up
```

**Option 3: AWS/GCP/Azure**

Use their respective deployment guides for Node.js applications.

### Deploy Frontend

**Option 1: Vercel**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**Option 2: Netlify**

```bash
# Build
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

## 📝 Environment Variables Checklist

### Required for Backend

- [ ] `SUPABASE_URL` - Your Supabase project URL
- [ ] `SUPABASE_ANON_KEY` - Supabase publishable key
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- [ ] `TWILIO_ACCOUNT_SID` - Twilio account SID
- [ ] `TWILIO_AUTH_TOKEN` - Twilio auth token
- [ ] `TWILIO_VERIFY_SERVICE_SID` - Twilio verify service SID
- [ ] `TWILIO_WHATSAPP_NUMBER` - Twilio WhatsApp number
- [ ] `JWT_SECRET` - Strong random secret
- [ ] `PORT` - Server port (default: 5000)
- [ ] `NODE_ENV` - Environment (development/production)

### Required for Frontend

- [ ] `REACT_APP_API_URL` - Backend API URL
- [ ] `REACT_APP_SUPABASE_URL` - Supabase URL
- [ ] `REACT_APP_SUPABASE_KEY` - Supabase key

## 🔗 Important Links

### Supabase
- **Dashboard:** https://supabase.com/dashboard
- **Documentation:** https://supabase.com/docs
- **Your Project:** https://sxghctohznlmuuyzyaut.supabase.co

### Twilio
- **Console:** https://www.twilio.com/console
- **Documentation:** https://www.twilio.com/docs
- **Verify API:** https://www.twilio.com/docs/verify/api

### Deployment Platforms
- **Vercel:** https://vercel.com
- **Netlify:** https://netlify.com
- **Heroku:** https://heroku.com
- **Railway:** https://railway.app

## 📞 Support

### Documentation Files
- `BACKEND_DATABASE_INTEGRATION.md` - Complete backend guide
- `BACKEND_SETUP_QUICK_START.md` - Quick setup guide
- `BACKEND_INTEGRATION_COMPLETE.md` - Implementation summary
- `TWILIO_README.md` - Twilio setup guide

### External Resources
- Supabase Support: https://supabase.com/support
- Twilio Support: https://www.twilio.com/help
- Node.js Docs: https://nodejs.org/docs

## ✅ Verification Checklist

### Local Development
- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:3000
- [ ] Database tables created in Supabase
- [ ] OTP sending working
- [ ] User registration working
- [ ] Shopkeeper creation working
- [ ] Product management working
- [ ] Order creation working

### Production
- [ ] Backend deployed
- [ ] Frontend deployed
- [ ] Database configured
- [ ] Environment variables set
- [ ] HTTPS enabled
- [ ] Monitoring configured
- [ ] Backups configured
- [ ] All endpoints tested

## 🎯 Next Steps

1. ✅ Database setup complete
2. ✅ Backend configured
3. ✅ Frontend ready
4. → Test locally
5. → Deploy to production
6. → Monitor and maintain

---

**Status:** Ready for Deployment  
**Last Updated:** March 2026  
**Version:** 1.0.0

## Quick Links

| Resource | URL |
|----------|-----|
| Supabase Dashboard | https://supabase.com/dashboard |
| Supabase Project | https://sxghctohznlmuuyzyaut.supabase.co |
| Backend API | http://localhost:5000 |
| Frontend App | http://localhost:3000 |
| Documentation | See files in root directory |

---

**Your application is ready to use!** 🎉

Start with the Quick Start guide: `BACKEND_SETUP_QUICK_START.md`
