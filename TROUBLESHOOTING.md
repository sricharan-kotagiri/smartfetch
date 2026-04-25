# SmartFetch Troubleshooting Guide

Common issues and solutions.

## Backend Issues

### Backend won't start

**Error: `Cannot find module`**
```bash
# Solution: Reinstall dependencies
cd backend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Error: `Port 5000 already in use`**
```bash
# Solution: Kill process on port 5000
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

**Error: `ENOENT: no such file or directory`**
```bash
# Solution: Ensure you're in backend directory
cd backend
npm run dev
```

### Email not sending

**Error: `Invalid 'From' address`**
- Check EMAIL_USER in .env matches your Gmail
- Verify email format is correct

**Error: `Invalid login credentials`**
- Verify EMAIL_PASSWORD is 16-character app password
- Check 2FA is enabled on Google account
- Generate new app password

**Error: `SMTP connection timeout`**
- Check internet connection
- Verify Gmail SMTP settings
- Try different email service

**Email goes to spam**
- Add SPF/DKIM records
- Use verified sender domain
- Check email template formatting

### Supabase connection errors

**Error: `SUPABASE_URL is required`**
```env
# Solution: Add to .env
SUPABASE_URL=https://your-project.supabase.co
```

**Error: `Invalid API key`**
- Verify SUPABASE_SERVICE_ROLE_KEY is correct
- Check key hasn't been rotated
- Generate new key if needed

**Error: `Database connection failed`**
- Check Supabase project is active
- Verify database tables exist
- Run SQL files in Supabase SQL Editor

**Error: `RLS policy violation`**
- Check RLS policies are configured
- Verify user has correct permissions
- Check policy syntax

### OTP not working

**Error: `OTP expired`**
- OTP expires after 10 minutes
- User must verify within time limit
- Resend OTP if expired

**Error: `Maximum OTP attempts exceeded`**
- User has 5 attempts to enter correct OTP
- Must resend OTP to try again
- Wait 30 seconds before resend

**Error: `OTP not found`**
- OTP may have been deleted
- User may be using wrong email
- Try resending OTP

**Error: `Redis connection failed`**
- Backend falls back to in-memory cache
- For production, ensure Redis is running
- Check REDIS_URL in .env

### Logging issues

**Error: `Logger not initialized`**
```bash
# Solution: Check logger.ts is imported
import { logger } from './middleware/logger.js'
```

**Logs not showing**
```env
# Solution: Set log level in .env
LOG_LEVEL=debug
```

## Frontend Issues

### Frontend won't start

**Error: `Cannot find module`**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Error: `Port 3000 already in use`**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

### API connection errors

**Error: `CORS error`**
- Check backend is running on port 5000
- Verify NEXT_PUBLIC_API_URL in .env
- Check backend CORS configuration

**Error: `Cannot POST /api/auth/send-otp`**
- Verify backend is running
- Check API_URL is correct
- Verify route exists in backend

**Error: `Network request failed`**
- Check internet connection
- Verify backend is accessible
- Check firewall settings

### Authentication not working

**Error: `OTP not received`**
- Check backend email service is working
- Verify Gmail credentials
- Check spam folder
- Look at backend logs

**Error: `OTP verification fails`**
- Ensure OTP is exactly 6 digits
- Check OTP hasn't expired
- Verify email/phone matches

**Error: `Token not stored`**
- Check localStorage is enabled
- Verify browser allows storage
- Check DevTools → Application → Local Storage

**Error: `User not logged in after verification`**
- Check token is being stored
- Verify user data is in state
- Check Redux/store dispatch

### UI issues

**Error: `Components not rendering`**
- Check component imports
- Verify component paths
- Check for TypeScript errors

**Error: `Styles not applied`**
- Verify Tailwind CSS is configured
- Check class names are correct
- Clear .next folder: `rm -rf .next`

**Error: `OTP input not accepting digits`**
- Check maxLength attribute
- Verify onChange handler
- Check input type is "text"

## Integration Issues

### Frontend can't connect to backend

**Checklist:**
- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:3000
- [ ] NEXT_PUBLIC_API_URL=http://localhost:5000
- [ ] No CORS errors in console
- [ ] Network tab shows requests

**Solution:**
```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd frontend
npm run dev

# Check http://localhost:5000/health returns OK
curl http://localhost:5000/health
```

### User data not persisting

**Check:**
1. Token is stored in localStorage
2. User data is in Redux store
3. API returns user data
4. Frontend stores response

**Debug:**
```javascript
// In browser console
localStorage.getItem('auth_token')
localStorage.getItem('user')
```

### OTP flow broken

**Check each step:**
1. Send OTP request succeeds
2. Email is received
3. OTP is correct format (6 digits)
4. Verify OTP request succeeds
5. Token is returned
6. User data is returned

**Debug:**
```bash
# Test backend directly
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

## Database Issues

### Tables don't exist

**Solution:**
1. Go to Supabase SQL Editor
2. Run `supabase-tables.sql`
3. Run `supabase-rls-policies.sql`
4. Verify tables appear in Tables list

### User not created

**Check:**
1. Supabase connection is working
2. Users table exists
3. RLS policies allow inserts
4. Email is unique

**Debug:**
```sql
-- In Supabase SQL Editor
SELECT * FROM users;
```

### RLS policies blocking access

**Solution:**
1. Check RLS is enabled
2. Verify policies are correct
3. Test with service role key
4. Check user ID matches

## Performance Issues

### Slow OTP sending

**Check:**
- Gmail connection speed
- Network latency
- Email template size
- Supabase query performance

**Solution:**
- Use Redis for caching
- Optimize email templates
- Add database indexes
- Monitor performance

### High memory usage

**Check:**
- In-memory cache size
- Number of concurrent users
- Redis memory usage
- Node.js heap size

**Solution:**
- Use Redis instead of memory cache
- Implement cache cleanup
- Monitor memory usage
- Scale horizontally

## Security Issues

### Token exposed

**Solution:**
- Use HTTPS in production
- Store token in HTTP-only cookie
- Implement token rotation
- Add CSRF protection

### OTP brute force

**Solution:**
- Implement rate limiting
- Add attempt limits (already done: 5 attempts)
- Add IP-based blocking
- Monitor suspicious activity

### SQL injection

**Solution:**
- Use parameterized queries (Supabase handles this)
- Validate all inputs
- Use RLS policies
- Regular security audits

## Deployment Issues

### Environment variables not loaded

**Solution:**
```bash
# Verify .env file exists
ls -la .env

# Check variables are set
echo $SUPABASE_URL

# Restart server after .env changes
npm run dev
```

### Build fails

**Solution:**
```bash
# Clear build cache
rm -rf .next dist

# Rebuild
npm run build

# Check for TypeScript errors
npm run type-check
```

### Production errors

**Solution:**
1. Check logs
2. Verify environment variables
3. Test API endpoints
4. Monitor error tracking
5. Check database backups

## Getting Help

### Check logs

**Backend:**
```bash
# Enable debug logging
LOG_LEVEL=debug npm run dev
```

**Frontend:**
```bash
# Check browser console (F12)
# Check Network tab for API calls
# Check Application → Local Storage
```

### Test endpoints

```bash
# Health check
curl http://localhost:5000/health

# Send OTP
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Check OTP status
curl -X POST http://localhost:5000/api/auth/check-otp-status \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### Common fixes

1. **Restart everything**
   ```bash
   # Kill all processes
   # Clear caches
   # Reinstall dependencies
   # Start fresh
   ```

2. **Clear caches**
   ```bash
   # Frontend
   rm -rf .next node_modules
   npm install
   
   # Backend
   rm -rf dist node_modules
   npm install
   ```

3. **Check versions**
   ```bash
   node --version  # Should be 18+
   npm --version   # Should be 8+
   ```

4. **Verify credentials**
   - Gmail app password (16 chars)
   - Supabase URL and key
   - JWT secret
   - API URLs

## Still stuck?

1. Check relevant setup guide
2. Review error messages carefully
3. Check browser console
4. Check backend logs
5. Test API endpoints directly
6. Verify all credentials
7. Try restarting everything
8. Check documentation

For detailed setup, see:
- `QUICKSTART.md`
- `BACKEND_SETUP.md`
- `FRONTEND_SETUP.md`
- `INTEGRATION_GUIDE.md`
