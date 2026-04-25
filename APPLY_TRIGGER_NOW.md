# 🚀 Apply Supabase Trigger - Step by Step

## ⏱️ Time Required: 2 Minutes

---

## 📋 What This Does

Automatically creates a user entry in `public.users` whenever someone signs up via Supabase Auth.

**Result**: No more foreign key constraint errors when creating shops!

---

## 🔧 Step-by-Step Instructions

### Step 1: Open Supabase Dashboard
1. Go to https://app.supabase.com
2. Select your SmartFetch project
3. Wait for dashboard to load

---

### Step 2: Open SQL Editor
1. Click **"SQL Editor"** in the left sidebar
2. Click **"New Query"** button (top right)
3. You should see a blank SQL editor

---

### Step 3: Copy the Trigger Code

**Option A: Copy from file**
1. Open file: `SUPABASE_AUTO_USER_CREATION_TRIGGER.sql`
2. Select all (Ctrl+A)
3. Copy (Ctrl+C)

**Option B: Copy from below**
```sql
-- =====================================================
-- AUTO-CREATE USER ENTRY ON AUTH SIGNUP
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (
    id,
    email,
    phone,
    full_name,
    role,
    auth_method,
    is_verified,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'full_name',
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer'),
    CASE 
      WHEN NEW.raw_user_meta_data->>'phone' IS NOT NULL THEN 'phone'
      ELSE 'email'
    END,
    NEW.email_confirmed_at IS NOT NULL,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

### Step 4: Paste into SQL Editor
1. Click in the SQL editor (blank area)
2. Paste (Ctrl+V)
3. You should see the SQL code

---

### Step 5: Run the Query
1. Click **"Run"** button (or press Ctrl+Enter)
2. Wait for execution to complete
3. Should see: **"Query executed successfully"**

---

### Step 6: Verify Success
1. Look for success message at bottom
2. No error messages should appear
3. If you see errors, check the error message

---

## ✅ Verification

### Check 1: Trigger Exists
Run this query in a new SQL Editor window:

```sql
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

### Check 2: Test with New Signup
1. Go to your app: http://localhost:3006
2. Sign up as a new customer or shopkeeper
3. Wait 2-3 seconds
4. Go back to Supabase Dashboard
5. Click **"Table Editor"** in left sidebar
6. Select **"public.users"** table
7. Should see your new user!

---

## 🎯 Expected Results

### After Applying Trigger

**When user signs up**:
- ✅ Auth user created in `auth.users`
- ✅ Trigger fires automatically
- ✅ User entry created in `public.users`
- ✅ Role extracted from metadata

**When shopkeeper creates shop**:
- ✅ Shopkeeper entry created in `shopkeepers` table
- ✅ Shop entry created in `shops` table
- ✅ No foreign key errors
- ✅ Redirect to dashboard works

---

## ⚠️ Troubleshooting

### Issue: "Query executed successfully" but nothing happens

**Solution**:
1. Check if trigger function exists:
   ```sql
   SELECT proname FROM pg_proc WHERE proname = 'handle_new_user';
   ```
2. Check if trigger exists:
   ```sql
   SELECT * FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created';
   ```

### Issue: Error message appears

**Solution**:
1. Read the error message carefully
2. Check if `public.users` table exists
3. Check if `auth.users` table exists
4. Try running the query again

### Issue: Trigger runs but users not appearing

**Solution**:
1. Check if RLS policies are blocking inserts
2. Check if trigger has correct permissions
3. Try manually inserting a user:
   ```sql
   INSERT INTO public.users (id, email, role) 
   VALUES ('test-id', 'test@example.com', 'customer');
   ```

---

## 📊 What the Trigger Does

```
User signs up via Supabase Auth
  ↓
auth.users table gets new row
  ↓
Trigger fires (on_auth_user_created)
  ↓
Trigger function (handle_new_user) executes
  ↓
Extracts data from auth.users:
  - id (UUID)
  - email
  - phone (from metadata)
  - full_name (from metadata)
  - role (from metadata, defaults to 'customer')
  ↓
Inserts into public.users
  ↓
✅ User now in database!
```

---

## 🔍 Monitoring

### Check Trigger Performance
```sql
SELECT 
  schemaname,
  tablename,
  trigname,
  calls,
  total_time
FROM pg_stat_user_triggers
WHERE trigname = 'on_auth_user_created';
```

### Check Recent Users
```sql
SELECT id, email, role, created_at
FROM public.users
ORDER BY created_at DESC
LIMIT 10;
```

---

## 🎉 Success!

Once the trigger is applied and verified:

1. ✅ Users automatically sync to database
2. ✅ Shop creation works without errors
3. ✅ Shopkeeper dashboard accessible
4. ✅ No more foreign key constraint errors

---

## 📞 Next Steps

1. ✅ Apply trigger (THIS STEP)
2. Test shopkeeper signup
3. Test shop creation
4. Test dashboard access
5. Monitor for errors

---

## 💡 Tips

- **Save the SQL**: Keep `SUPABASE_AUTO_USER_CREATION_TRIGGER.sql` for reference
- **Test Immediately**: Sign up a new user right after applying trigger
- **Check Logs**: Monitor browser console and backend logs
- **Monitor Database**: Check `public.users` table regularly

---

**Status**: Ready to apply ✅
**Time**: 2 minutes
**Risk**: None (non-destructive)
**Rollback**: Easy (drop trigger)

---

## 🚀 Ready?

1. Open Supabase Dashboard
2. Go to SQL Editor
3. Copy the trigger code
4. Paste and run
5. Verify success
6. Test with new signup

**Let's go!** 🎯
