# BudgetFlow - Personal Budget Tracker 💰

BudgetFlow is a full-stack budget tracking application built with Vue 3 and NestJS. It helps users track income, expenses, and spending categories with a modern, responsive interface.

**Live Demo:** http://localhost:5173 (after running locally)

---

## ✨ Features

✅ **Dashboard Overview**
- Total income, expenses, and net balance
- Recent transactions display
- Real-time statistics

✅ **Transaction Management**
- View all transactions with filtering
- Create, update, and delete transactions
- Filter by category and date range
- Category-based color coding

✅ **Account Management**
- Multiple account support
- View all accounts with balances
- Account type management

✅ **Statistics & Analytics**
- Summary of income vs expenses
- Spending breakdown by category
- Monthly summaries

✅ **Responsive Design**
- Mobile-first approach
- Tailwind CSS styling
- Professional UI with gradients and animations

✅ **API Integration**
- RESTful API with proper error handling
- Type-safe communication (TypeScript)
- CORS support for development

---

## 🧰 Tech Stack

### Frontend
- **Vue.js 3** - Progressive JavaScript framework
- **TypeScript** - Type safety
- **Vite** - Lightning-fast build tool
- **Pinia** - State management
- **Vue Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type safety
- **Express** - HTTP framework (via NestJS)
- **In-Memory Storage** - Sample data (can be replaced with database)

### Development
- **CORS Enabled** - Cross-origin requests handled
- **Hot Reload** - Auto-refresh on code changes
- **Type Checking** - Full TypeScript support

---

## 📂 Project Structure

```
BudgetFlow/
├── client/                          # Vue 3 Frontend
│   ├── src/
│   │   ├── components/              # Vue components
│   │   │   ├── Dashboard.vue        # Main dashboard
│   │   │   ├── TransactionsPage.vue # Transactions view
│   │   │   ├── AccountsPage.vue     # Accounts view
│   │   │   ├── Header.vue           # Navigation header
│   │   │   └── ...
│   │   ├── services/
│   │   │   └── api.ts               # API service layer
│   │   ├── stores/
│   │   │   └── transactions.ts      # Pinia store
│   │   ├── router/
│   │   │   └── index.ts             # Vue Router config
│   │   ├── App.vue                  # Root component
│   │   └── main.ts                  # Entry point
│   ├── vite.config.ts               # Vite configuration
│   ├── .env.local                   # Environment variables
│   └── package.json
│
├── backend/                         # NestJS Backend
│   ├── src/
│   │   ├── transactions/            # Transactions module
│   │   │   ├── transactions.controller.ts
│   │   │   ├── transactions.service.ts
│   │   │   ├── transactions.module.ts
│   │   │   ├── dto/
│   │   │   │   └── create-transaction.dto.ts
│   │   │   └── entities/
│   │   │       └── transaction.entity.ts
│   │   ├── accounts/                # Accounts module
│   │   ├── stats/                   # Statistics module
│   │   ├── app.module.ts            # Root module
│   │   ├── app.controller.ts        # Root controller
│   │   ├── main.ts                  # Entry point
│   │   └── ...
│   ├── .env.local                   # Environment variables
│   └── package.json
│
├── QUICKSTART.md                    # Quick start guide (30 seconds!)
├── DEVELOPMENT.md                   # Full development guide
├── CORS_GUIDE.md                    # CORS troubleshooting
├── CORS_FIX.md                      # Technical CORS details
├── DIAGNOSTIC.md                    # Diagnostic checklist
└── README.md                        # This file
```

---

## 🚀 Quick Start (30 seconds)

### Prerequisites
- Node.js 20.19.0+ or 22.12.0+
- npm or pnpm

### Installation & Running

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run start:dev
```
Expected output: `🚀 Backend running on http://localhost:3000`

**Terminal 2 - Frontend:**
```bash
cd client
npm install
npm run dev
```
Expected output: `➜  Local:   http://localhost:5173/`

**Open Browser:**
```
http://localhost:5173
```

That's it! 🎉

---

## 📡 API Endpoints

All endpoints are prefixed with `/api/`:

### Transactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions` | Get all transactions |
| GET | `/api/transactions/:id` | Get single transaction |
| GET | `/api/transactions?category=Food` | Filter by category |
| GET | `/api/transactions?startDate=...&endDate=...` | Filter by date range |
| POST | `/api/transactions` | Create new transaction |
| PUT | `/api/transactions/:id` | Update transaction |
| DELETE | `/api/transactions/:id` | Delete transaction |

### Accounts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/accounts` | Get all accounts |
| GET | `/api/accounts/:id` | Get single account |
| GET | `/api/accounts/total-balance` | Get total balance |
| POST | `/api/accounts` | Create new account |
| PUT | `/api/accounts/:id` | Update account |
| DELETE | `/api/accounts/:id` | Delete account |

### Statistics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stats/summary` | Get balance summary |
| GET | `/api/stats/spending-by-category` | Get spending by category |
| GET | `/api/stats/monthly-summary` | Get monthly summary |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |

---

## 🔧 Development Commands

### Frontend
```bash
cd client

# Development server
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check

# Linting
npm run lint
```

### Backend
```bash
cd backend

# Development server (watch mode)
npm run start:dev

# Production build
npm run build

# Production start
npm run start:prod

# Testing
npm run test

# Linting
npm run lint
```

---

## 🌍 Environment Configuration

### Frontend (client/.env.local)
```env
# API Base URL
VITE_API_URL=http://localhost:3000/api
```

### Backend (backend/.env.local)
```env
# Server port
PORT=3000

# CORS configuration
CORS_ORIGIN=http://localhost:5173

# Environment
NODE_ENV=development
```

---

## � Example Transaction Object

```typescript
{
  id: "t1",
  title: "Salary",
  amount: 3000,
  date: "2025-11-01",
  category: "Income",
  notes: "Monthly salary",
  createdAt: "2025-11-01T00:00:00Z",
  updatedAt: "2025-11-01T00:00:00Z"
}
```

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 3000 is in use
lsof -i :3000

# If needed, kill the process
lsof -ti :3000 | xargs kill -9
```

### Frontend won't load
```bash
# Check if port 5173 is in use
lsof -i :5173

# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

### API returns "Not Found"
1. Ensure backend is running: `npm run start:dev` in backend folder
2. Check backend console for error messages
3. Verify CORS configuration in `backend/.env.local`
4. See `CORS_GUIDE.md` for detailed troubleshooting

### CORS Errors
See `CORS_GUIDE.md` for comprehensive CORS troubleshooting guide.

---

## 📚 Documentation

- **QUICKSTART.md** - 30-second setup guide
- **DEVELOPMENT.md** - Complete development guide
- **CORS_GUIDE.md** - CORS explanation and troubleshooting
- **CORS_FIX.md** - Technical details of CORS implementation
- **DIAGNOSTIC.md** - Step-by-step diagnostic checklist

---

## 🗺️ Roadmap

- [ ] Database integration (PostgreSQL + TypeORM)
- [ ] User authentication & authorization
- [ ] Transaction categories customization
- [ ] Advanced filtering & search
- [ ] Data export (CSV, PDF)
- [ ] Budget goals & tracking
- [ ] Monthly reports
- [ ] Mobile app (React Native)

---

## 💡 Sample Data

The application comes with sample data:

**Transactions:**
- Salary: +€3,000 (Income)
- Groceries: -€120.50 (Food)
- Rent: -€800 (Housing)

**Accounts:**
- Main Account: €2,500.50 (Checking)
- Savings Account: €10,000 (Savings)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

MIT License - feel free to use and modify as needed.

---

## 👤 Author

Federico Guarda - [GitHub](https://github.com/Fede1082)

---

## ❓ Need Help?

1. Check `DIAGNOSTIC.md` for step-by-step troubleshooting
2. Review `CORS_GUIDE.md` for API communication issues
3. Check the backend console for error messages
4. Open an issue on GitHub

**Happy budgeting! 🎉**

