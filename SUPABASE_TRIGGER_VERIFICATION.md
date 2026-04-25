# Supabase Trigger Verification & Testing

## 🔧 How to Apply the Trigger

### Method 1: Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**
   - Go to https://app.supabase.com
   - Select your project

2. **Navigate to SQL Editor**
   - Click "SQL Editor" in left sidebar
   - Click "New Query"

3. **Copy & Paste the Trigger**
   - Open file: `SUPABASE_AUTO_USER_CREATION_TRIGGER.sql`
   - Copy entire content
   - Paste into SQL Editor

4. **Run the Query**
   - Click "Run" button (or Ctrl+Enter)
   - Wait for success message

5. **Verify Success**
   - Should see: "Query executed successfully"
   - No errors in output

---

## ✅ Verification Steps

### Step 1: Check Trigger Exists

Run this query in SQL Editor:

```sql
-- Check if trigger exists
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
```

**Expected Output**:
```
trigger_name          | event_manipulation | event_object_table
on_auth_user_created  | INSERT             | users
```

---

### Step 2: Check Trigger Function Exists

Run this query:

```sql
-- Check if trigger function exists
SELECT proname, prosrc
FROM pg_proc
WHERE proname = 'handle_new_user';
```

**Expected Output**: Should show the function definition

---

### Step 3: Test with Existing Users

If you already have auth users, manually sync them:

```sql
-- Manually create users for existing auth users
INSERT INTO public.users (id, email, full_name, role, created_at, updated_at)
SELECT 
  id,
  email,
  raw_user_meta_data->>'full_name' as full_name,
  COALESCE(raw_user_meta_data->>'role', 'customer') as role,
  created_at,
  updated_at
FROM auth.users
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  updated_at = NOW();
```

**Expected Output**: Should show number of rows inserted/updated

---

### Step 4: Test with New Signup

1. **Sign up a new user** (customer or shopkeeper)
2. **Wait 2-3 seconds**
3. **Check if user appears in public.users**:

```sql
-- Check if new user was created
SELECT id, email, role, created_at
FROM public.users
ORDER BY created_at DESC
LIMIT 5;
```

**Expected Output**: New user should appear with correct role

---

## 🧪 Full Test Scenario

### Test 1: New Customer Signup

```sql
-- Before signup: Check user count
SELECT COUNT(*) as user_count FROM public.users;

-- After signup: Check if new user appears
SELECT id, email, role, created_at
FROM public.users
WHERE email = 'newcustomer@example.com';

-- Expected: User exists with role = 'customer'
```

### Test 2: New Shopkeeper Signup

```sql
-- After shopkeeper signup: Check if user appears
SELECT id, email, role, created_at
FROM public.users
WHERE email = 'newshopkeeper@example.com';

-- Expected: User exists with role = 'shopkeeper'
```

### Test 3: Shop Creation

```sql
-- After shop creation: Check all related entries
SELECT 
  u.id as user_id,
  u.email,
  u.role,
  s.id as shopkeeper_id,
  s.shop_name,
  sh.id as shop_id,
  sh.name as shop_name
FROM public.users u
LEFT JOIN shopkeepers s ON u.id = s.user_id
LEFT JOIN shops sh ON s.id = sh.shopkeeper_id
WHERE u.email = 'shopkeeper@example.com';

-- Expected: All three entries should exist with correct relationships
```

---

## 🔍 Debugging Queries

### Check Trigger Logs

```sql
-- View recent trigger executions
SELECT 
  schemaname,
  tablename,
  trigname,
  tgtype,
  tgenabled
FROM pg_trigger
WHERE tgname = 'on_auth_user_created';
```

### Check for Errors

```sql
-- Check if there are any constraint violations
SELECT * FROM public.users WHERE id IS NULL;
-- Should return 0 rows

-- Check for duplicate users
SELECT email, COUNT(*) as count
FROM public.users
GROUP BY email
HAVING COUNT(*) > 1;
-- Should return 0 rows
```

### Check User Metadata

```sql
-- View what metadata is being stored
SELECT 
  id,
  email,
  raw_user_meta_data
FROM auth.users
LIMIT 5;

-- Check if role is in metadata
SELECT 
  id,
  email,
  raw_user_meta_data->>'role' as role,
  raw_user_meta_data->>'full_name' as full_name,
  raw_user_meta_data->>'phone' as phone
FROM auth.users
LIMIT 5;
```

---

## ⚠️ Troubleshooting

### Issue: Trigger Not Firing

**Symptoms**: New users don't appear in `public.users`

**Solutions**:
1. Check if trigger exists: Run verification query above
2. Check if trigger is enabled:
   ```sql
   SELECT tgenabled FROM pg_trigger WHERE tgname = 'on_auth_user_created';
   -- Should return 't' (true)
   ```
3. Enable trigger if disabled:
   ```sql
   ALTER TABLE auth.users ENABLE TRIGGER on_auth_user_created;
   ```

### Issue: Foreign Key Constraint Error

**Symptoms**: Can't create shop - "foreign key constraint violation"

**Solutions**:
1. Check if shopkeeper entry exists:
   ```sql
   SELECT * FROM shopkeepers WHERE user_id = 'USER_ID_HERE';
   ```
2. Check if user exists in public.users:
   ```sql
   SELECT * FROM public.users WHERE id = 'USER_ID_HERE';
   ```
3. Manually create missing entries if needed

### Issue: Duplicate User Entries

**Symptoms**: Multiple entries for same user

**Solutions**:
1. Check for duplicates:
   ```sql
   SELECT email, COUNT(*) FROM public.users GROUP BY email HAVING COUNT(*) > 1;
   ```
2. Delete duplicates (keep most recent):
   ```sql
   DELETE FROM public.users
   WHERE id NOT IN (
     SELECT DISTINCT ON (email) id
     FROM public.users
     ORDER BY email, created_at DESC
   );
   ```

---

## 📊 Monitoring

### Check Trigger Performance

```sql
-- View trigger statistics
SELECT 
  schemaname,
  tablename,
  trigname,
  calls,
  total_time,
  self_time
FROM pg_stat_user_triggers
WHERE trigname = 'on_auth_user_created';
```

### Monitor User Creation Rate

```sql
-- Check how many users created in last hour
SELECT COUNT(*) as users_created_last_hour
FROM public.users
WHERE created_at > NOW() - INTERVAL '1 hour';
```

---

## ✅ Final Verification Checklist

- [ ] Trigger created successfully
- [ ] Trigger function exists
- [ ] Trigger is enabled
- [ ] Test user created and appears in public.users
- [ ] User has correct role
- [ ] Shopkeeper can create shop
- [ ] Shop creation doesn't fail with foreign key error
- [ ] All three tables (users, shopkeepers, shops) have entries
- [ ] No duplicate users
- [ ] No orphaned records

---

## 🚀 You're Ready!

Once all checks pass, the system is ready for:
- ✅ User signup (customer and shopkeeper)
- ✅ Shop creation
- ✅ Product management
- ✅ Order processing
- ✅ Dashboard access

---

## 📞 Quick Reference

| Task | Query |
|------|-------|
| Check trigger exists | `SELECT * FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created';` |
| Check users created | `SELECT COUNT(*) FROM public.users;` |
| Check shopkeepers | `SELECT COUNT(*) FROM shopkeepers;` |
| Check shops | `SELECT COUNT(*) FROM shops;` |
| View recent users | `SELECT * FROM public.users ORDER BY created_at DESC LIMIT 10;` |
| View user with role | `SELECT id, email, role FROM public.users WHERE email = 'user@example.com';` |

---

**Last Updated**: April 19, 2026
**Status**: ✅ Ready for Testing
