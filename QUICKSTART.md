# BudgetFlow - Quick Start 🚀

## 30-Second Setup

### Prerequisites
- Node.js 20.19.0+ or 22.12.0+
- npm or pnpm

### 1️⃣ Install Backend
```bash
cd backend
npm install
```

### 2️⃣ Install Frontend
```bash
cd ../client
npm install
```

### 3️⃣ Start Backend (Terminal 1)
```bash
cd backend
npm run start:dev
```
Expected: `🚀 Backend running on http://localhost:3000`

### 4️⃣ Start Frontend (Terminal 2)
```bash
cd client
npm run dev
```
Expected: `➜  Local:   http://localhost:5173/`

### 5️⃣ Open Browser
Navigate to `http://localhost:5173` and start using BudgetFlow! 🎉

## What Works

✅ Dashboard with income/expense summary
✅ View all transactions with filtering
✅ Delete transactions
✅ View accounts
✅ Real-time API communication
✅ No CORS errors (Vite proxy + CORS headers)

## API Endpoints

All prefixed with `/api`:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/transactions` | Get all transactions |
| POST | `/transactions` | Create transaction |
| PUT | `/transactions/:id` | Update transaction |
| DELETE | `/transactions/:id` | Delete transaction |
| GET | `/accounts` | Get all accounts |
| GET | `/stats/summary` | Get financial summary |
| GET | `/health` | Health check |

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend won't start | Check port 3000 not in use: `lsof -i :3000` |
| Frontend won't load | Check port 5173 not in use: `lsof -i :5173` |
| CORS errors | Ensure both backend and frontend are running |
| API calls fail | Check backend console for error messages |
| Dependencies missing | Run `npm install` again |

## Stop Running Services

```bash
# Press Ctrl+C in each terminal
# Or: kill processes by port
lsof -ti :3000 | xargs kill -9   # Kill backend
lsof -ti :5173 | xargs kill -9   # Kill frontend
```

## File Structure

```
BudgetFlow/
├── backend/          # NestJS server (http://localhost:3000)
├── client/           # Vue 3 app (http://localhost:5173)
├── DEVELOPMENT.md    # Full development guide
├── CORS_GUIDE.md     # CORS troubleshooting
└── CORS_FIX.md       # What was fixed
```

## Next Steps

- [ ] Create add/edit transaction modal
- [ ] Add account management UI
- [ ] Implement search/filters
- [ ] Add user authentication
- [ ] Connect to database (PostgreSQL)
- [ ] Deploy to production

---

**Need help?** Check `DEVELOPMENT.md` for detailed setup or `CORS_GUIDE.md` for CORS issues.
