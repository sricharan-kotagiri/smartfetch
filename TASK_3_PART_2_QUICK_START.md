# TASK 3 PART 2: Orders & Dashboard Pages - Quick Start

## What's Next

This part focuses on creating the Orders page for customers and the Dashboard page for shopkeepers.

## Files to Create/Update

### 1. Create Orders Page
**File**: `frontend/src/pages/OrdersPage.tsx`

**Features**:
- Display all customer orders
- Filter by status (all, pending, confirmed, delivered, cancelled)
- Show order details: order ID, date, total, status
- Action buttons: View Details, Track, Cancel, Reorder
- Empty state when no orders
- Loading state

**Data Structure**:
```typescript
interface Order {
  id: string
  customer_id: string
  total: number
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled'
  created_at: string
  items: OrderItem[]
}
```

### 2. Create Shopkeeper Dashboard
**File**: `frontend/src/pages/dashboard/DashboardPage.tsx`

**Features**:
- Dashboard stats cards:
  - Total Orders (count)
  - Total Revenue (sum)
  - Active Products (count)
  - Pending Orders (count)
- Recent orders list (last 5)
- Quick alerts (low stock, pending orders)
- Charts (optional: orders trend, revenue trend)

**Data Structure**:
```typescript
interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  activeProducts: number
  pendingOrders: number
}
```

### 3. Update Products Page
**File**: `frontend/src/pages/dashboard/ProductsPage.tsx`

**New Fields to Add**:
- MRP (Maximum Retail Price)
- Brand
- Discount (percentage)
- Unit Type (kg, liter, piece, etc.)
- Expiry Date
- Minimum Order Quantity

**Form Updates**:
- Add input fields for all new columns
- Validation for prices and quantities
- Date picker for expiry date

### 4. Database Schema Updates
**SQL to Run**:
```sql
ALTER TABLE products ADD COLUMN IF NOT EXISTS mrp DECIMAL(10,2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS brand TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS discount INTEGER DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS unit_type TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS expiry_date DATE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS min_order_qty INTEGER DEFAULT 1;
```

## Routes to Verify in App.tsx

```typescript
// Customer routes
<Route path="/orders" element={<AuthGuard role="customer"><OrdersPage /></AuthGuard>} />

// Shopkeeper routes
<Route path="/dashboard" element={<AuthGuard role="shopkeeper"><DashboardPage /></AuthGuard>} />
<Route path="/dashboard/products" element={<AuthGuard role="shopkeeper"><ProductsPage /></AuthGuard>} />
```

## Key Implementation Notes

### Orders Page
- Use `supabase.from('orders').select('*').eq('customer_id', userId)`
- Join with order_items for line items
- Show status badge with color coding:
  - pending: yellow
  - confirmed: blue
  - delivered: green
  - cancelled: red

### Dashboard Page
- Calculate stats from orders and products tables
- Use aggregation queries for performance
- Show recent orders with shopkeeper's products only
- Alert if any products have low stock

### Products Page
- Update form to include all new fields
- Validate MRP >= price
- Validate discount is 0-100
- Validate min_order_qty >= 1
- Show expiry date in product list

## Testing Checklist

- [ ] Orders page loads for customer
- [ ] Orders page shows all customer orders
- [ ] Filter by status works
- [ ] Dashboard page loads for shopkeeper
- [ ] Dashboard stats calculate correctly
- [ ] Products page shows new fields
- [ ] Can create product with all fields
- [ ] Can edit product with all fields
- [ ] Database columns exist and store data

## Design Standards

- Use CSS variables for colors
- Match existing card styling
- Mobile responsive
- Loading states with spinners
- Error handling with toast messages
- Empty states with helpful messages

## Performance Tips

- Use `select()` to fetch only needed columns
- Implement pagination for large order lists
- Cache dashboard stats (5-minute TTL)
- Use indexes on frequently queried columns

---

**Ready to start TASK 3 PART 2**
