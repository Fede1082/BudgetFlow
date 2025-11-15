# CORS Troubleshooting Guide

## What is CORS?
CORS (Cross-Origin Resource Sharing) is a security mechanism that prevents browsers from making requests to different domains. During development, you may encounter CORS errors.

## How BudgetFlow Solves CORS

### Development (Recommended)
BudgetFlow uses **Vite's built-in proxy** to handle API requests, which completely bypasses CORS issues:

```
Browser (localhost:5173) 
    ↓
Vite Proxy (/api → localhost:3000)
    ↓
Backend (localhost:3000/api)
```

**Configuration**: `client/vite.config.ts`
```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  },
}
```

### Production
BudgetFlow uses **CORS headers** to allow requests from your frontend domain:

```typescript
app.enableCors({
  origin: process.env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

## Common CORS Errors & Solutions

### Error: "No 'Access-Control-Allow-Origin' header"
**Cause**: Backend is not allowing requests from frontend domain

**Solution**:
1. ✅ Make sure backend is running: `npm run start:dev` in `backend/` folder
2. ✅ Check `.env.local` has correct CORS_ORIGIN:
   ```env
   CORS_ORIGIN=http://localhost:5173
   ```
3. ✅ Vite proxy is configured in `client/vite.config.ts`
4. Restart backend if you modified `.env.local`

### Error: "Credentials mode is 'include'"
**Cause**: Backend allows credentials but frontend doesn't send them

**Solution**:
- Backend is already configured with `credentials: true`
- Frontend API service already includes credentials in requests
- No action needed ✅

### Error: "Method not allowed"
**Cause**: Backend CORS doesn't allow the HTTP method (POST, PUT, DELETE, etc.)

**Solution**:
- Verify backend CORS config allows all methods:
  ```typescript
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  ```
- Check `backend/src/main.ts` ✅ (already configured)

## Step-by-Step Debugging

### 1. Verify Backend is Running
```bash
curl http://localhost:3000/api/health
# Should return: {"status":"ok","timestamp":"..."}
```

### 2. Verify Frontend Vite Proxy
Open browser dev tools → Network tab → Make a request to `/api/transactions`
- Should show request going to `localhost:5173/api/transactions`
- Response should come from `localhost:3000/api/transactions`

### 3. Check Environment Variables
**Backend**:
```bash
cd backend
cat .env.local
# Should show: CORS_ORIGIN=http://localhost:5173
```

**Frontend**:
```bash
cd client
cat .env.local
# Should show: VITE_API_URL=/api
```

### 4. Browser Console Errors
Look for messages like:
- ❌ `Access to XMLHttpRequest at 'http://localhost:3000/api/transactions' from origin 'http://localhost:5173' has been blocked`
  → Backend CORS issue → Check .env.local and restart backend

- ❌ `Failed to fetch`
  → Backend not running → Start backend with `npm run start:dev`

- ✅ Requests showing in Network tab
  → Everything working correctly!

## Testing CORS with curl

### Test Backend Directly (Bypass CORS)
```bash
curl -H "Origin: http://localhost:5173" \
     -H "Access-Control-Request-Method: POST" \
     http://localhost:3000/api/transactions

# Should return data without CORS errors
```

### Test with Frontend Proxy
```bash
# From client folder, run dev server
npm run dev

# In another terminal, test through proxy
curl http://localhost:5173/api/transactions
# Should return data
```

## Configuration Files

### client/vite.config.ts
Sets up proxy for `/api` → `http://localhost:3000`

### client/.env.local
```env
VITE_API_URL=/api
```
Using relative `/api` works because Vite proxy handles it.

### backend/src/main.ts
```typescript
app.enableCors({
  origin: process.env.CORS_ORIGIN ?? ['http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

### backend/.env.local
```env
CORS_ORIGIN=http://localhost:5173
```

## Production Considerations

For production deployment, you may need different handling:

1. **Same Domain**: Serve frontend and backend from same domain
   - No CORS needed
   - Use relative URLs for API

2. **Different Domains**: Use CORS headers
   - Set `CORS_ORIGIN=https://your-frontend.com`
   - Implement proper CSRF protection

3. **Reverse Proxy**: Use nginx/Apache to proxy requests
   - Frontend: `https://your-domain.com`
   - Backend: Internal only
   - No CORS needed

## Quick Fixes

### ✅ Most Common Solution
Just ensure both are running:
```bash
# Terminal 1: Backend
cd backend && npm install && npm run start:dev

# Terminal 2: Frontend
cd client && npm install && npm run dev
```

### ✅ If Issues Persist
1. Delete `.env.local` and recreate from `.env.example`
2. Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
3. Restart both backend and frontend
4. Check browser console for specific error messages

## Still Having Issues?

1. **Check Port Conflicts**: 
   - Backend should run on port 3000
   - Frontend should run on port 5173
   - `lsof -i :3000` and `lsof -i :5173` to check

2. **Firewall Issues**:
   - Ensure localhost is allowed
   - Try `http://127.0.0.1` instead of `localhost`

3. **Browser Issues**:
   - Clear cache: Ctrl+Shift+Delete
   - Use incognito/private window
   - Try different browser

4. **Check Logs**:
   - Backend: Look for CORS configuration messages
   - Frontend: Open browser DevTools → Console tab
   - Network tab shows actual requests/responses
