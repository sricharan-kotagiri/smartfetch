# Customer Data Management Guide

Complete guide for managing customer data in SmartFetch.

## Customer Data Storage

All customer data is stored in Supabase PostgreSQL database.

### Data Stored Per Customer

```json
{
  "id": "uuid",
  "email": "customer@example.com",
  "phone": "+91XXXXXXXXXX",
  "full_name": "Customer Name",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-02T00:00:00Z",
  "is_active": true,
  "deleted_at": null
}
```

## Customer Registration Flow

### Step 1: Customer Enters Email/Phone
```
Frontend → POST /api/auth/send-otp
{
  "email": "customer@example.com",
  "userName": "John Doe"
}
```

### Step 2: OTP Sent
- OTP generated (6 digits)
- Stored in Redis (10 min expiry)
- Email sent to customer

### Step 3: Customer Verifies OTP
```
Frontend → POST /api/auth/verify-otp
{
  "email": "customer@example.com",
  "otp": "123456"
}
```

### Step 4: Customer Created in Database
- New customer record created
- Email stored (unique)
- Phone stored (unique)
- Name stored
- Timestamp recorded
- JWT token generated

### Step 5: Customer Logged In
- Token stored in frontend
- Customer data available
- Session maintained

## API Endpoints for Customer Data

### Send OTP
```
POST /api/auth/send-otp
Content-Type: application/json

{
  "email": "customer@example.com",
  "userName": "John Doe"
}

Response:
{
  "success": true,
  "message": "OTP sent successfully",
  "expiresIn": 600
}
```

### Verify OTP & Create Customer
```
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "customer@example.com",
  "otp": "123456"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "customer@example.com",
    "full_name": "John Doe",
    "phone": null
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Get Customer Profile
```
GET /api/users/profile/550e8400-e29b-41d4-a716-446655440000
Authorization: Bearer {token}

Response:
{
  "success": true,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "customer@example.com",
    "phone": "+919876543210",
    "full_name": "John Doe",
    "created_at": "2024-01-01T10:00:00Z",
    "updated_at": "2024-01-01T10:00:00Z",
    "is_active": true,
    "deleted_at": null
  }
}
```

### Update Customer Profile
```
PUT /api/users/profile/550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json
Authorization: Bearer {token}

{
  "full_name": "John Updated",
  "phone": "+919876543210",
  "email": "newemail@example.com"
}

Response:
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "newemail@example.com",
    "phone": "+919876543210",
    "full_name": "John Updated",
    "updated_at": "2024-01-02T10:00:00Z"
  }
}
```

### Get All Customers
```
GET /api/users/all?limit=100&offset=0
Authorization: Bearer {admin_token}

Response:
{
  "success": true,
  "users": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "customer1@example.com",
      "phone": "+919876543210",
      "full_name": "Customer 1",
      "created_at": "2024-01-01T10:00:00Z"
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "email": "customer2@example.com",
      "phone": "+919876543211",
      "full_name": "Customer 2",
      "created_at": "2024-01-02T10:00:00Z"
    }
  ],
  "total": 2,
  "limit": 100,
  "offset": 0
}
```

### Search Customers
```
GET /api/users/search?q=john
Authorization: Bearer {admin_token}

Response:
{
  "success": true,
  "users": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "john@example.com",
      "phone": "+919876543210",
      "full_name": "John Doe",
      "created_at": "2024-01-01T10:00:00Z"
    }
  ]
}
```

## Customer Data in Supabase

### View Customers in Dashboard

1. Go to https://sxghctohznlmuuyzyaut.supabase.co
2. Click **Table Editor** in left sidebar
3. Select **users** table
4. View all customers
5. Click on a customer to see details

### Query Customers via SQL

```sql
-- Get all customers
SELECT * FROM users WHERE is_active = true;

-- Get customer by email
SELECT * FROM users WHERE email = 'customer@example.com';

-- Get customer by phone
SELECT * FROM users WHERE phone = '+919876543210';

-- Get customers created today
SELECT * FROM users WHERE DATE(created_at) = TODAY();

-- Count total customers
SELECT COUNT(*) FROM users WHERE is_active = true;

-- Search customers by name
SELECT * FROM users WHERE full_name ILIKE '%john%';
```

## Customer Data Lifecycle

### 1. Registration
- Customer enters email/phone
- OTP sent and verified
- Account created in database
- Welcome email sent

### 2. Active Use
- Customer logs in
- Profile data retrieved
- Session maintained
- Data updated as needed

### 3. Profile Updates
- Customer updates name
- Customer updates phone
- Customer updates email
- Changes saved to database

### 4. Logout
- Session ended
- Token invalidated
- Data persists in database

### 5. Account Deletion (Soft Delete)
- Account marked as inactive
- Data preserved
- Can be reactivated
- Deletion timestamp recorded

## Data Security

### Row Level Security (RLS)

Customers can only access their own data:

```sql
-- Customers can read their own data
CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Customers can update their own data
CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);
```

### Data Encryption

- Passwords: Not stored (OTP-based auth)
- Email: Indexed for fast lookup
- Phone: Indexed for fast lookup
- Data in transit: HTTPS only
- Data at rest: Encrypted by Supabase

### Access Control

- Service role key: Full access (backend only)
- User token: Own data only
- Public: No direct access

## Monitoring Customer Data

### Backend Logs

```bash
# Check backend logs
npm run dev

# Look for:
# - "New user created: email@example.com"
# - "User logged in: email@example.com"
# - "User profile updated: user-id"
```

### Database Logs

1. Go to Supabase dashboard
2. Click **Logs** in left sidebar
3. View database queries
4. Monitor customer operations

### Metrics

- Total customers: `SELECT COUNT(*) FROM users`
- Active customers: `SELECT COUNT(*) FROM users WHERE is_active = true`
- New customers today: `SELECT COUNT(*) FROM users WHERE DATE(created_at) = TODAY()`

## Backup & Recovery

### Automatic Backups
- Daily backups by Supabase
- 30-day retention
- Point-in-time recovery available

### Manual Backup
```bash
# Export customer data
SELECT * FROM users;

# Save to CSV in Supabase dashboard
# Table Editor → Export → CSV
```

### Restore Data
1. Go to Supabase dashboard
2. Settings → Backups
3. Select backup date
4. Click Restore

## Compliance

### Data Privacy
- GDPR compliant
- Data retention policies
- User consent tracking
- Right to be forgotten

### Data Protection
- Encryption at rest
- Encryption in transit
- Access logging
- Regular audits

## Testing Customer Data

### Test Registration
```bash
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","userName":"Test User"}'
```

### Test Verification
```bash
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"123456"}'
```

### Test Profile Retrieval
```bash
curl http://localhost:5000/api/users/profile/user-id \
  -H "Authorization: Bearer token"
```

## Troubleshooting

### Customer Not Created
- Check email format
- Verify OTP was correct
- Check database logs
- Verify RLS policies

### Data Not Saving
- Check RLS policies
- Verify user permissions
- Check database connection
- Review error logs

### Duplicate Customers
- Email should be unique
- Phone should be unique
- Check for duplicates in database
- Merge if needed

## Next Steps

1. ✅ Set up Supabase database
2. ✅ Create database tables
3. ✅ Configure backend
4. ✅ Test customer registration
5. ✅ Verify data storage
6. ✅ Monitor customer data
7. ✅ Set up backups

---

**Status**: Customer data storage ready ✅

All customer data is securely stored in Supabase PostgreSQL database.
