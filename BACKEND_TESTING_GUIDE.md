# Backend API Testing Guide

## Quick Start

### 1. Start Backend
```bash
cd backend
npm install  # First time only
npm run dev
```

Backend runs on `http://localhost:5000`

### 2. Test Health Check
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

## Testing Endpoints

### AUTH ENDPOINTS

#### 1. Register Customer
```bash
curl -X POST http://localhost:5000/api/auth/register-customer \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "password": "SecurePass123!",
    "full_name": "John Customer",
    "phone": "+1234567890"
  }'
```

#### 2. Register Shopkeeper
```bash
curl -X POST http://localhost:5000/api/auth/register-shopkeeper \
  -H "Content-Type: application/json" \
  -d '{
    "email": "shopkeeper@example.com",
    "password": "SecurePass123!",
    "full_name": "Jane Shopkeeper",
    "phone": "+0987654321"
  }'
```

#### 3. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "password": "SecurePass123!"
  }'
```

Response includes `access_token` - save this for authenticated requests.

#### 4. Get Current User
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### 5. Logout
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Content-Type: application/json"
```

#### 6. Resend Verification
```bash
curl -X POST http://localhost:5000/api/auth/resend-verification \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com"
  }'
```

#### 7. Forgot Password
```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com"
  }'
```

#### 8. Reset Password
```bash
curl -X POST http://localhost:5000/api/auth/reset-password \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "newPassword": "NewSecurePass456!"
  }'
```

#### 9. Delete Account
```bash
curl -X DELETE http://localhost:5000/api/auth/delete-account \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### SHOP ENDPOINTS

#### 1. Create Shop (Shopkeeper Only)
```bash
curl -X POST http://localhost:5000/api/shops \
  -H "Authorization: Bearer SHOPKEEPER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "shop_name": "Fresh Groceries",
    "location": "123 Main St, City",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "opening_time": "09:00",
    "closing_time": "21:00",
    "upi_id": "shopkeeper@upi"
  }'
```

#### 2. Get All Shops
```bash
curl -X GET http://localhost:5000/api/shops
```

#### 3. Get Shop by ID
```bash
curl -X GET http://localhost:5000/api/shops/SHOP_ID
```

#### 4. Update Shop
```bash
curl -X PUT http://localhost:5000/api/shops/SHOP_ID \
  -H "Authorization: Bearer SHOPKEEPER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "shop_name": "Fresh Groceries Updated",
    "opening_time": "08:00"
  }'
```

#### 5. Toggle Shop Status
```bash
curl -X PATCH http://localhost:5000/api/shops/SHOP_ID/toggle \
  -H "Authorization: Bearer SHOPKEEPER_TOKEN"
```

#### 6. Delete Shop
```bash
curl -X DELETE http://localhost:5000/api/shops/SHOP_ID \
  -H "Authorization: Bearer SHOPKEEPER_TOKEN"
```

---

### PRODUCT ENDPOINTS

#### 1. Create Product (Shopkeeper Only)
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer SHOPKEEPER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "shop_id": "SHOP_ID",
    "product_name": "Organic Apples",
    "category": "Fruits",
    "price": 5.99,
    "stock_quantity": 100,
    "description": "Fresh organic apples",
    "image_url": "https://example.com/apple.jpg"
  }'
```

#### 2. Get All Products
```bash
curl -X GET http://localhost:5000/api/products
```

#### 3. Get Products by Shop
```bash
curl -X GET "http://localhost:5000/api/products?shop_id=SHOP_ID"
```

#### 4. Get Product by ID
```bash
curl -X GET http://localhost:5000/api/products/PRODUCT_ID
```

#### 5. Update Product
```bash
curl -X PUT http://localhost:5000/api/products/PRODUCT_ID \
  -H "Authorization: Bearer SHOPKEEPER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 6.99,
    "stock_quantity": 80
  }'
```

#### 6. Toggle Product Availability
```bash
curl -X PATCH http://localhost:5000/api/products/PRODUCT_ID/availability \
  -H "Authorization: Bearer SHOPKEEPER_TOKEN"
```

#### 7. Delete Product
```bash
curl -X DELETE http://localhost:5000/api/products/PRODUCT_ID \
  -H "Authorization: Bearer SHOPKEEPER_TOKEN"
```

---

### CART ENDPOINTS

#### 1. Get Cart
```bash
curl -X GET http://localhost:5000/api/cart \
  -H "Authorization: Bearer CUSTOMER_TOKEN"
```

#### 2. Add to Cart
```bash
curl -X POST http://localhost:5000/api/cart \
  -H "Authorization: Bearer CUSTOMER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "PRODUCT_ID",
    "quantity": 2
  }'
```

#### 3. Update Cart Item
```bash
curl -X PUT http://localhost:5000/api/cart/CART_ITEM_ID \
  -H "Authorization: Bearer CUSTOMER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 5
  }'
```

#### 4. Remove from Cart
```bash
curl -X DELETE http://localhost:5000/api/cart/CART_ITEM_ID \
  -H "Authorization: Bearer CUSTOMER_TOKEN"
```

#### 5. Clear Cart
```bash
curl -X DELETE http://localhost:5000/api/cart \
  -H "Authorization: Bearer CUSTOMER_TOKEN"
```

---

### ORDER ENDPOINTS

#### 1. Create Order (Generates Pickup Code + QR)
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer CUSTOMER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "shop_id": "SHOP_ID",
    "items": [
      {
        "product_id": "PRODUCT_ID_1",
        "quantity": 2
      },
      {
        "product_id": "PRODUCT_ID_2",
        "quantity": 1
      }
    ],
    "payment_method": "upi",
    "pickup_time": "2026-03-28T15:30:00Z"
  }'
```

Response includes:
- `pickup_code`: SF-XXXXXX format
- `qr_data`: JSON object to encode in QR code

#### 2. Get Customer Orders
```bash
curl -X GET http://localhost:5000/api/orders/customer \
  -H "Authorization: Bearer CUSTOMER_TOKEN"
```

#### 3. Get Shop Orders (Shopkeeper Only)
```bash
curl -X GET http://localhost:5000/api/orders/shop/SHOP_ID \
  -H "Authorization: Bearer SHOPKEEPER_TOKEN"
```

#### 4. Get Order by ID
```bash
curl -X GET http://localhost:5000/api/orders/ORDER_ID \
  -H "Authorization: Bearer TOKEN"
```

#### 5. Update Order Status (Shopkeeper Only)
```bash
curl -X PATCH http://localhost:5000/api/orders/ORDER_ID/status \
  -H "Authorization: Bearer SHOPKEEPER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "ready"
  }'
```

Valid statuses: `pending`, `confirmed`, `ready`, `picked_up`, `cancelled`

#### 6. Get Order Receipt
```bash
curl -X GET http://localhost:5000/api/orders/ORDER_ID/receipt \
  -H "Authorization: Bearer TOKEN"
```

---

### MESSAGE ENDPOINTS

#### 1. Get Order Messages
```bash
curl -X GET http://localhost:5000/api/messages/ORDER_ID \
  -H "Authorization: Bearer TOKEN"
```

#### 2. Send Message
```bash
curl -X POST http://localhost:5000/api/messages/ORDER_ID \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "When will my order be ready?"
  }'
```

#### 3. Mark Messages as Read
```bash
curl -X PATCH http://localhost:5000/api/messages/ORDER_ID/read \
  -H "Authorization: Bearer TOKEN"
```

---

### CUSTOMER ENDPOINTS

#### 1. Get Profile
```bash
curl -X GET http://localhost:5000/api/customers/profile \
  -H "Authorization: Bearer CUSTOMER_TOKEN"
```

#### 2. Update Profile
```bash
curl -X PUT http://localhost:5000/api/customers/profile \
  -H "Authorization: Bearer CUSTOMER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "John Updated",
    "phone": "+1111111111"
  }'
```

---

## Testing Workflow

### Complete Customer Flow
1. Register customer
2. Verify email (check Supabase email)
3. Login
4. Get all shops
5. Get shop details
6. Get products by shop
7. Add items to cart
8. Create order (generates pickup code + QR)
9. Get order details
10. Send message
11. Get messages
12. Mark messages as read

### Complete Shopkeeper Flow
1. Register shopkeeper
2. Verify email
3. Login
4. Create shop
5. Create products
6. Get shop orders
7. Update order status
8. Send message
9. Get messages

---

## Debugging Tips

### Check Logs
Backend logs all requests and errors. Look for:
- Auth middleware errors
- Supabase query errors
- Validation errors

### Common Issues

**401 Unauthorized**
- Token expired or invalid
- Missing Authorization header
- Token format incorrect (should be `Bearer TOKEN`)

**403 Forbidden**
- User doesn't own the resource
- Shopkeeper trying to access customer endpoint
- Customer trying to create shop

**404 Not Found**
- Resource doesn't exist
- Wrong ID format

**400 Bad Request**
- Missing required fields
- Invalid field values
- Stock insufficient

### Test with Postman
1. Create collection for SmartFetch API
2. Set base URL: `http://localhost:5000`
3. Create environment variable for token
4. Use pre-request scripts to set Authorization header
5. Test each endpoint

---

## Performance Notes

- Pickup code generation retries up to 5 times
- All queries use Supabase indexes
- Cart items include product details via join
- Orders include items via join
- Messages ordered by created_at

---

**Ready to test!** 🚀
