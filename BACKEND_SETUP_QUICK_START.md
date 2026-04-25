# Backend Setup - Quick Start

## 5-Minute Setup

### Step 1: Get Supabase Credentials

Your Supabase Project:
- **URL:** https://sxghctohznlmuuyzyaut.supabase.co
- **Publishable Key:** sb_publishable_-2RkCH2acDi9UYlZ7F2Pcw_y8jWLHml

1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to Settings → API
4. Copy:
   - Project URL
   - Anon Key (Publishable)
   - Service Role Key (Secret)

### Step 2: Create Database Tables

1. Go to Supabase Dashboard → SQL Editor
2. Create new query
3. Copy entire contents of `supabase-complete-schema.sql`
4. Execute

### Step 3: Update Environment

Create `backend/.env`:

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

### Step 4: Install & Start

```bash
cd backend
npm install
npm start
```

Expected output:
```
Server running on http://localhost:5000
```

## API Quick Reference

### Authentication
```bash
# Send OTP
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "9876543210"}'

# Verify OTP
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "9876543210", "otp": "123456", "role": "customer"}'
```

### Shopkeeper
```bash
# Create shop
curl -X POST http://localhost:5000/api/shopkeepers/create-shop \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "uuid",
    "shop_name": "My Shop",
    "owner_name": "John Doe",
    "upi_id": "john@upi",
    "location": "123 Main St",
    "latitude": 28.7041,
    "longitude": 77.1025
  }'

# Get shop profile
curl http://localhost:5000/api/shopkeepers/profile/uuid
```

### Products
```bash
# Add product
curl -X POST http://localhost:5000/api/products/add-product \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "uuid",
    "product_name": "Rice",
    "category": "grocery",
    "price": 50.00,
    "stock_quantity": 100
  }'

# Get all products
curl http://localhost:5000/api/products

# Search products
curl http://localhost:5000/api/products/search/rice
```

### Orders
```bash
# Create order
curl -X POST http://localhost:5000/api/orders/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "uuid",
    "delivery_address": "123 Main St",
    "items": [
      {"product_id": "uuid", "quantity": 2}
    ]
  }'

# Get user orders
curl http://localhost:5000/api/orders/user/uuid

# Get order details
curl http://localhost:5000/api/orders/uuid
```

## Database Tables

| Table | Purpose |
|-------|---------|
| users | Store user info (phone, role) |
| shopkeepers | Store shop details |
| products | Store product catalog |
| orders | Store customer orders |
| order_items | Store items in each order |
| otp_logs | Track OTP activity |

## Key Features

✅ **Structured Data** - All data in Supabase tables  
✅ **Relationships** - Foreign keys linking tables  
✅ **Security** - RLS policies for data access  
✅ **Logging** - OTP activity tracked  
✅ **Validation** - Input validation on all endpoints  
✅ **Error Handling** - Proper error responses  

## Testing

### Test User Registration
1. Send OTP to your phone
2. Get OTP from WhatsApp
3. Verify OTP
4. User created in database

### Test Shopkeeper Flow
1. Login as shopkeeper
2. Create shop
3. Add products
4. View products

### Test Customer Flow
1. Login as customer
2. Browse products
3. Create order
4. View orders

## Troubleshooting

**Error: "SUPABASE_URL not found"**
- Check `.env` file exists
- Verify SUPABASE_URL is set

**Error: "Connection refused"**
- Check Redis is running
- Check Supabase is accessible

**Error: "Unauthorized"**
- Check JWT token is valid
- Check user_id matches

**Error: "Product not found"**
- Verify product_id exists
- Check product belongs to correct shop

## Next Steps

1. ✅ Database setup complete
2. ✅ Backend running
3. → Frontend integration
4. → Deploy to production

## Support

- Supabase Docs: https://supabase.com/docs
- Backend Docs: See `BACKEND_DATABASE_INTEGRATION.md`
- Twilio Docs: https://www.twilio.com/docs

---

**Status:** Ready to Use  
**Last Updated:** March 2026
