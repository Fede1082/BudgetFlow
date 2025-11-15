# BudgetFlow - Diagnostic Checklist

## 🔍 Diagnose API "Not Found" Errors

### Step 1: Verify Backend is Running
```bash
# In a terminal, check if backend is listening on port 3000
curl http://localhost:3000/api/health

# Should return:
# {"status":"ok","timestamp":"2025-11-15T..."}
```

If this fails:
1. Open a NEW terminal
2. Navigate to backend folder: `cd backend`
3. Start backend: `npm run start:dev`
4. Wait for: `🚀 Backend running on http://localhost:3000`

### Step 2: Verify Frontend Vite Dev Server is Running
```bash
# In another terminal, check if frontend is running on port 5173
curl http://localhost:5173/

# Should return HTML (the Vue app)
```

If this fails:
1. Open a NEW terminal
2. Navigate to client folder: `cd client`
3. Start frontend: `npm run dev`
4. Wait for: `➜  Local:   http://localhost:5173/`

### Step 3: Verify Vite Proxy Configuration
```bash
# Test the proxy by making a request through frontend port
curl http://localhost:5173/api/health

# Should return:
# {"status":"ok","timestamp":"2025-11-15T..."}
# (Same as backend response - proxied!)
```

If this fails:
1. Stop Vite: Ctrl+C in frontend terminal
2. Restart Vite: `npm run dev`
3. Try curl again

### Step 4: Check Environment Variables
```bash
# Check frontend .env.local
cat client/.env.local
# Should show: VITE_API_URL=/api

# Check backend .env.local
cat backend/.env.local
# Should show: CORS_ORIGIN=http://localhost:5173
```

### Step 5: Open Browser and Test
1. Open: http://localhost:5173
2. Open DevTools: F12 or Cmd+Option+I
3. Go to Network tab
4. Click on Transactions page (or any page that calls API)
5. Look for `/api/transactions` request
6. Check status code:
   - ✅ 200 OK → Everything works!
   - ❌ 404 Not Found → Backend not responding
   - ❌ Pending/timeout → Connection issue

### Step 6: Check Backend Logs
Look at the terminal where backend is running:
- Should show requests coming in like: `GET /api/transactions`
- Should show status code 200
- Look for any error messages

## Common Issues & Solutions

| Problem | Solution |
|---------|----------|
| "Cannot GET /api/transactions" | Backend not running → `cd backend && npm run start:dev` |
| Request pending/timeout | Port 3000 blocked → Check firewall or use `lsof -i :3000` |
| CORS error in browser | Restart Vite → Stop with Ctrl+C, then `npm run dev` |
| Module not found 'uuid' | Install deps → `cd backend && npm install` |
| Vite dev server won't start | Port 5173 in use → `lsof -i :5173` or change port |

## Quick Commands

### Start Everything Fresh
```bash
# Terminal 1: Backend
cd backend
npm install
npm run start:dev

# Terminal 2: Frontend  
cd client
npm install
npm run dev

# Terminal 3: Test (optional)
curl http://localhost:5173/api/health
```

### Kill Stuck Processes
```bash
# Kill backend (port 3000)
lsof -ti :3000 | xargs kill -9

# Kill frontend (port 5173)
lsof -ti :5173 | xargs kill -9
```

## Success Indicators

✅ Backend terminal shows: `🚀 Backend running on http://localhost:3000`
✅ Frontend terminal shows: `➜  Local:   http://localhost:5173/`
✅ Browser Network tab shows `/api/transactions` with status 200
✅ Browser console has NO error messages
✅ Dashboard shows data (income, expenses, balance)
✅ Transactions page shows transaction list

## If Still Having Issues

1. **Check backend logs** - Any error messages?
2. **Check browser console** - Any error messages?
3. **Check Network tab** - What's the actual request/response?
4. **Reinstall dependencies**:
   ```bash
   cd backend && rm -rf node_modules && npm install
   cd ../client && rm -rf node_modules && npm install
   ```
5. **Restart both servers** - Sometimes Vite cache causes issues
