# Backend Database Integration Guide

## Overview

This document describes the complete backend-integrated system using Node.js and Supabase for structured data storage with proper relationships.

## Database Schema

### Tables

#### 1. Users Table
```sql
id (UUID, primary key)
phone (unique)
role (customer / shopkeeper)
created_at (timestamp)
updated_at (timestamp)
```

#### 2. Shopkeepers Table
```sql
id (UUID, primary key)
user_id (foreign key → users.id)
shop_name (string)
owner_name (string)
upi_id (string, optional)
location (string, optional)
latitude (decimal, optional)
longitude (decimal, optional)
created_at (timestamp)
updated_at (timestamp)
```

#### 3. Products Table
```sql
id (UUID, primary key)
shop_id (foreign key → shopkeepers.id)
product_name (string)
category (string)
price (decimal)
stock_quantity (integer)
description (text, optional)
image_url (string, optional)
created_at (timestamp)
updated_at (timestamp)
```

#### 4. Orders Table
```sql
id (UUID, primary key)
user_id (foreign key → users.id)
total_amount (decimal)
status (pending / completed / cancelled)
delivery_address (text, optional)
created_at (timestamp)
updated_at (timestamp)
```

#### 5. Order_Items Table
```sql
id (UUID, primary key)
order_id (foreign key → orders.id)
product_id (foreign key → products.id)
quantity (integer)
price (decimal)
created_at (timestamp)
```

#### 6. OTP_Logs Table
```sql
id (UUID, primary key)
phone (string)
status (sent / verified / failed)
error_message (text, optional)
created_at (timestamp)
```

## Setup Instructions

### Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Create a new project
3. Get your project URL and API keys

### Step 2: Run Database Schema

1. Go to Supabase Dashboard → SQL Editor
2. Create a new query
3. Copy and paste the contents of `supabase-complete-schema.sql`
4. Execute the query

This will create:
- All tables with proper relationships
- Indexes for performance
- Row Level Security (RLS) policies

### Step 3: Configure Environment Variables

Update `backend/.env`:

```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Twilio
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
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

# Redis
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=

# Logging
LOG_LEVEL=debug
```

### Step 4: Install Dependencies

```bash
cd backend
npm install
```

### Step 5: Start Backend

```bash
npm start
```

## API Endpoints

### Authentication

#### Send OTP
```
POST /api/auth/send-otp
Content-Type: application/json

{
  "phone": "9876543210"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully via WhatsApp",
  "expiresIn": 300
}
```

#### Verify OTP & Login
```
POST /api/auth/verify-otp
Content-Type: application/json

{
  "phone": "9876543210",
  "otp": "123456",
  "role": "customer"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "phone": "9876543210",
    "full_name": "User",
    "role": "customer"
  },
  "token": "jwt-token"
}
```

### Shopkeeper Management

#### Create Shop
```
POST /api/shopkeepers/create-shop
Content-Type: application/json

{
  "user_id": "uuid",
  "shop_name": "My Shop",
  "owner_name": "John Doe",
  "upi_id": "john@upi",
  "location": "123 Main St",
  "latitude": 28.7041,
  "longitude": 77.1025
}
```

**Response:**
```json
{
  "success": true,
  "message": "Shop created successfully",
  "shopkeeper": {
    "id": "uuid",
    "user_id": "uuid",
    "shop_name": "My Shop",
    "owner_name": "John Doe",
    "upi_id": "john@upi",
    "location": "123 Main St",
    "latitude": 28.7041,
    "longitude": 77.1025,
    "created_at": "2024-03-17T10:00:00Z"
  }
}
```

#### Get Shopkeeper Profile
```
GET /api/shopkeepers/profile/:user_id
```

#### Update Shopkeeper Profile
```
PUT /api/shopkeepers/profile/:user_id
Content-Type: application/json

{
  "shop_name": "Updated Shop Name",
  "owner_name": "Jane Doe",
  "upi_id": "jane@upi"
}
```

#### Get All Shopkeepers
```
GET /api/shopkeepers/all?limit=50&offset=0
```

#### Search Shopkeepers by Location
```
POST /api/shopkeepers/search-location
Content-Type: application/json

{
  "latitude": 28.7041,
  "longitude": 77.1025,
  "radius": 5
}
```

### Product Management

#### Add Product
```
POST /api/products/add-product
Content-Type: application/json

{
  "user_id": "uuid",
  "product_name": "Rice",
  "category": "grocery",
  "price": 50.00,
  "stock_quantity": 100,
  "description": "Premium rice",
  "image_url": "https://example.com/rice.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product added successfully",
  "product": {
    "id": "uuid",
    "shop_id": "uuid",
    "product_name": "Rice",
    "category": "grocery",
    "price": 50.00,
    "stock_quantity": 100,
    "description": "Premium rice",
    "image_url": "https://example.com/rice.jpg",
    "created_at": "2024-03-17T10:00:00Z"
  }
}
```

#### Get All Products
```
GET /api/products?limit=50&offset=0
```

#### Get Products by Shop
```
GET /api/products/shop/:shop_id?limit=50&offset=0
```

#### Search Products
```
GET /api/products/search/:query?limit=50
```

#### Get Products by Category
```
GET /api/products/category/:category?limit=50
```

#### Update Product
```
PUT /api/products/:id
Content-Type: application/json

{
  "user_id": "uuid",
  "product_name": "Premium Rice",
  "price": 60.00,
  "stock_quantity": 80
}
```

#### Delete Product
```
DELETE /api/products/:id
Content-Type: application/json

{
  "user_id": "uuid"
}
```

### Order Management

#### Create Order
```
POST /api/orders/create-order
Content-Type: application/json

{
  "user_id": "uuid",
  "delivery_address": "123 Main St, City",
  "items": [
    {
      "product_id": "uuid",
      "quantity": 2
    },
    {
      "product_id": "uuid",
      "quantity": 1
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "order": {
    "id": "uuid",
    "user_id": "uuid",
    "total_amount": 150.00,
    "status": "pending",
    "delivery_address": "123 Main St, City",
    "items": [
      {
        "product_id": "uuid",
        "quantity": 2,
        "price": 50.00
      }
    ],
    "created_at": "2024-03-17T10:00:00Z"
  }
}
```

#### Get Order by ID
```
GET /api/orders/:id
```

#### Get User Orders
```
GET /api/orders/user/:user_id?limit=50&offset=0
```

#### Get Order Items
```
GET /api/orders/:order_id/items
```

#### Update Order Status
```
PUT /api/orders/:id
Content-Type: application/json

{
  "status": "completed",
  "delivery_address": "Updated address"
}
```

#### Cancel Order
```
POST /api/orders/:id/cancel
```

## Data Flow

### User Registration & Login

1. **Send OTP**
   - User enters phone number
   - Backend sends OTP via Twilio WhatsApp
   - OTP logged in `otp_logs` table

2. **Verify OTP**
   - User enters OTP from WhatsApp
   - Backend verifies with Twilio
   - OTP logged as verified
   - Check if user exists in `users` table
   - If not, create new user with role
   - Generate JWT token

3. **User Created in Database**
   - Phone number stored (unique)
   - Role assigned (customer/shopkeeper)
   - Timestamp recorded

### Shopkeeper Registration

1. **User logs in as shopkeeper**
2. **Create shop profile**
   - Shop details stored in `shopkeepers` table
   - Linked to user via `user_id`
   - Location coordinates stored for discovery

### Product Management

1. **Shopkeeper adds product**
   - Product stored in `products` table
   - Linked to shop via `shop_id`
   - Stock quantity tracked

2. **Customer browses products**
   - Query `products` table
   - Filter by category or search
   - Display with shop information

### Order Processing

1. **Customer creates order**
   - Order created in `orders` table
   - Items stored in `order_items` table
   - Stock quantities updated in `products` table
   - Total amount calculated

2. **Order tracking**
   - Customer can view their orders
   - Status updated (pending → completed)
   - Order can be cancelled (stock restored)

## Security Features

### Row Level Security (RLS)

- Users can only view their own data
- Shopkeepers can only manage their own products
- Customers can only view their own orders
- Products are viewable by all authenticated users

### Authentication

- JWT tokens for session management
- Phone-based authentication via Twilio OTP
- Role-based access control (customer/shopkeeper)

### Data Validation

- Phone number format validation
- Product price and quantity validation
- Order item validation
- Stock availability checks

## Best Practices

### Database Operations

1. **Always use transactions** for multi-step operations
2. **Validate input** before database operations
3. **Use indexes** for frequently queried fields
4. **Log all operations** for audit trail

### API Design

1. **Use proper HTTP status codes**
   - 200: Success
   - 201: Created
   - 400: Bad request
   - 401: Unauthorized
   - 403: Forbidden
   - 404: Not found
   - 500: Server error

2. **Consistent response format**
   ```json
   {
     "success": true/false,
     "message": "Description",
     "data": {}
   }
   ```

3. **Error handling**
   - Meaningful error messages
   - Proper error codes
   - Logging for debugging

### Performance

1. **Use pagination** for list endpoints
2. **Create indexes** on frequently queried fields
3. **Cache frequently accessed data**
4. **Optimize queries** to avoid N+1 problems

## Troubleshooting

### Common Issues

**Issue: "User already has a shop"**
- Solution: User can only have one shop
- Delete existing shop first if needed

**Issue: "Insufficient stock"**
- Solution: Product doesn't have enough quantity
- Update stock or choose different product

**Issue: "Unauthorized to update product"**
- Solution: Only shopkeeper who created product can update it
- Use correct user_id

**Issue: "OTP verification failed"**
- Solution: Check OTP hasn't expired (5 minutes)
- Request new OTP if needed

## Monitoring

### OTP Logs

Track OTP activity:
```sql
SELECT * FROM otp_logs WHERE phone = '9876543210' ORDER BY created_at DESC;
```

### Order Statistics

Get order stats:
```sql
SELECT status, COUNT(*) as count FROM orders GROUP BY status;
```

### Product Inventory

Check stock levels:
```sql
SELECT product_name, stock_quantity FROM products WHERE stock_quantity < 10;
```

## Deployment

### Production Checklist

- [ ] Use production Supabase project
- [ ] Enable HTTPS
- [ ] Set strong JWT secret
- [ ] Configure CORS properly
- [ ] Enable RLS policies
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Test all endpoints
- [ ] Load test the system

### Environment Variables

```env
NODE_ENV=production
SUPABASE_URL=https://your-production-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_production_key
JWT_SECRET=generate-strong-random-secret
```

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check Supabase logs
4. Check backend logs

---

**Status:** Production Ready  
**Last Updated:** March 2026  
**Version:** 1.0.0
