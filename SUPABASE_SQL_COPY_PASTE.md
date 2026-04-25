# Supabase SQL - Copy & Paste Ready

## Instructions
1. Go to Supabase Dashboard
2. Click **SQL Editor** → **New Query**
3. Copy the SQL below
4. Paste into the editor
5. Click **Run**
6. Wait for success

---

## Complete SQL Schema

```sql
-- ============================================================================
-- SMARTFETCH DATABASE SCHEMA - COPY & PASTE INTO SUPABASE SQL EDITOR
-- ============================================================================

-- CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'customer',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SHOPKEEPERS TABLE
CREATE TABLE IF NOT EXISTS shopkeepers (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  upi_id TEXT,
  role TEXT DEFAULT 'shopkeeper',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SHOPS TABLE
CREATE TABLE IF NOT EXISTS shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shopkeeper_id UUID NOT NULL REFERENCES shopkeepers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  address TEXT,
  city TEXT,
  latitude FLOAT,
  longitude FLOAT,
  image_url TEXT,
  opening_time TIME,
  closing_time TIME,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  image_url TEXT,
  category TEXT,
  stock_quantity INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',
  total_amount NUMERIC NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  upi_transaction_id TEXT,
  pickup_code TEXT UNIQUE,
  pickup_time TIME,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price NUMERIC NOT NULL,
  subtotal NUMERIC NOT NULL
);

-- CART ITEMS TABLE
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(customer_id, product_id)
);

-- ORDER MESSAGES TABLE
CREATE TABLE IF NOT EXISTS order_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id),
  sender_role TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopkeepers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES

-- SHOPS POLICIES
CREATE POLICY "Public read active shops" ON shops
  FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Shopkeeper manage own shop" ON shops
  FOR ALL
  USING (auth.uid() = shopkeeper_id);

-- PRODUCTS POLICIES
CREATE POLICY "Public read available products" ON products
  FOR SELECT
  USING (is_available = TRUE);

CREATE POLICY "Shopkeeper manage own products" ON products
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM shops
      WHERE shops.id = products.shop_id
      AND shops.shopkeeper_id = auth.uid()
    )
  );

-- CUSTOMERS POLICIES
CREATE POLICY "Customers read own data" ON customers
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Customers update own data" ON customers
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Customers delete own data" ON customers
  FOR DELETE
  USING (auth.uid() = id);

-- SHOPKEEPERS POLICIES
CREATE POLICY "Shopkeepers read own data" ON shopkeepers
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Shopkeepers update own data" ON shopkeepers
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Shopkeepers delete own data" ON shopkeepers
  FOR DELETE
  USING (auth.uid() = id);

-- ORDERS POLICIES
CREATE POLICY "Customers manage own orders" ON orders
  FOR ALL
  USING (auth.uid() = customer_id);

CREATE POLICY "Shopkeepers read own shop orders" ON orders
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM shops
      WHERE shops.id = orders.shop_id
      AND shops.shopkeeper_id = auth.uid()
    )
  );

CREATE POLICY "Shopkeepers update own shop orders" ON orders
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM shops
      WHERE shops.id = orders.shop_id
      AND shops.shopkeeper_id = auth.uid()
    )
  );

-- CART ITEMS POLICIES
CREATE POLICY "Customers manage own cart" ON cart_items
  FOR ALL
  USING (auth.uid() = customer_id);

-- ORDER MESSAGES POLICIES
CREATE POLICY "Users read own messages" ON order_messages
  FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() IN (
    SELECT customer_id FROM orders WHERE orders.id = order_messages.order_id
  ) OR auth.uid() IN (
    SELECT shopkeeper_id FROM shops WHERE shops.id IN (
      SELECT shop_id FROM orders WHERE orders.id = order_messages.order_id
    )
  ));

CREATE POLICY "Users create messages" ON order_messages
  FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_shops_shopkeeper_id ON shops(shopkeeper_id);
CREATE INDEX IF NOT EXISTS idx_shops_is_active ON shops(is_active);
CREATE INDEX IF NOT EXISTS idx_products_shop_id ON products(shop_id);
CREATE INDEX IF NOT EXISTS idx_products_is_available ON products(is_available);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_shop_id ON orders(shop_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_customer_id ON cart_items(customer_id);
CREATE INDEX IF NOT EXISTS idx_order_messages_order_id ON order_messages(order_id);
CREATE INDEX IF NOT EXISTS idx_order_messages_sender_id ON order_messages(sender_id);

-- TRIGGER FOR UPDATED_AT
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

## After Running SQL

### Step 1: Verify Tables Created
1. Go to Supabase Dashboard
2. Click **Table Editor**
3. You should see all 8 tables:
   - customers
   - shopkeepers
   - shops
   - products
   - orders
   - order_items
   - cart_items
   - order_messages

### Step 2: Configure Email Authentication
1. Go to **Authentication** → **Providers**
2. Find **Email** provider
3. Toggle **Enabled** to ON
4. Toggle **Confirm email before login** to ON
5. Scroll down to **Redirect URLs**
6. Add: `http://localhost:3003/verify-success`
7. Click **Save**

### Step 3: Test Connection
1. Go to **SQL Editor** → **New Query**
2. Run this test query:
```sql
SELECT COUNT(*) as table_count FROM information_schema.tables 
WHERE table_schema = 'public';
```
3. Should return 8 tables

---

## Troubleshooting

### Error: "relation already exists"
- This is normal if you've run the script before
- The `IF NOT EXISTS` clause prevents errors
- Just run it again, it will skip existing tables

### Error: "permission denied"
- Make sure you're using the correct Supabase project
- Check that you're logged in as the project owner

### Tables not showing in Table Editor
- Refresh the page
- Check that you're in the correct project
- Verify the SQL ran without errors

---

## Next Steps

1. ✅ Run this SQL in Supabase
2. ✅ Configure Email Authentication
3. ✅ Test database connection
4. ✅ Build frontend pages
5. ✅ Build backend API endpoints

**You're ready to start building!** 🚀
