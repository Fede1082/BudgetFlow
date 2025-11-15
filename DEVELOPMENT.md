# BudgetFlow - Development Setup Guide

## Overview
BudgetFlow is a full-stack budget tracking application built with:
- **Frontend**: Vue 3 + TypeScript + Vite + Tailwind CSS
- **Backend**: NestJS + TypeScript
- **State Management**: Pinia
- **API Communication**: Fetch API with Vite proxy

## Prerequisites
- Node.js 20.19.0 or >=22.12.0
- npm or pnpm package manager

## Project Structure
```
BudgetFlow/
├── client/                 # Vue 3 frontend application
│   ├── src/
│   │   ├── components/    # Vue components (Dashboard, Transactions, Accounts, etc.)
│   │   ├── services/      # API service layer (api.ts)
│   │   ├── stores/        # Pinia store
│   │   └── router/        # Vue Router configuration
│   ├── vite.config.ts     # Vite configuration with API proxy
│   ├── .env.local         # Local environment variables
│   └── package.json
│
└── backend/               # NestJS backend application
    ├── src/
    │   ├── transactions/  # Transactions module (service, controller)
    │   ├── accounts/      # Accounts module (service, controller)
    │   ├── stats/         # Statistics module
    │   └── app.module.ts  # Root module
    ├── .env.local         # Local environment variables
    └── package.json
```

## Installation

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Install Frontend Dependencies
```bash
cd ../client
npm install
```

## Running the Application

### Start Backend (Terminal 1)
```bash
cd backend
npm run start:dev
```

Expected output:
```
🚀 Backend running on http://localhost:3000
📝 CORS Origin: http://localhost:5173
```

### Start Frontend (Terminal 2)
```bash
cd client
npm run dev
```

Expected output:
```
➜  Local:   http://localhost:5173/
```

## Environment Configuration

### Backend (.env.local)
Located at: `backend/.env.local`
```env
PORT=3000
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

### Frontend (.env.local)
Located at: `client/.env.local`
```env
VITE_API_URL=/api
```

**Note**: The frontend uses Vite's proxy to forward `/api` requests to the backend at `http://localhost:3000/api`. This eliminates CORS issues during development.

## API Endpoints

All endpoints are prefixed with `/api`:

### Transactions
- `GET /api/transactions` - Get all transactions (supports `?category=` and `?startDate=&endDate=` query params)
- `GET /api/transactions/:id` - Get single transaction
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Accounts
- `GET /api/accounts` - Get all accounts
- `GET /api/accounts/:id` - Get single account
- `POST /api/accounts` - Create account
- `PUT /api/accounts/:id` - Update account
- `DELETE /api/accounts/:id` - Delete account

### Statistics
- `GET /api/stats/summary` - Get balance summary (income, expenses, net)
- `GET /api/stats/spending-by-category` - Get spending breakdown by category
- `GET /api/stats/monthly-summary` - Get monthly summary (optional `?month=` query param)

### Health
- `GET /api/health` - Health check endpoint

## Development Workflow

### TypeScript Type Checking
```bash
# Frontend
cd client
npm run type-check

# Backend
cd backend
npm run lint
```

### Linting
```bash
# Frontend
npm run lint

# Backend
npm run lint
```

### Building
```bash
# Frontend
npm run build

# Backend
npm run build
```

## Troubleshooting

### CORS Errors
1. ✅ Vite proxy is configured to forward `/api` requests to `http://localhost:3000`
2. ✅ Backend CORS is enabled for `http://localhost:5173`
3. Ensure both backend and frontend are running
4. Check `.env.local` files are correctly configured

### Backend Connection Issues
1. Verify backend is running on port 3000
2. Check CORS_ORIGIN environment variable matches frontend URL
3. Ensure all dependencies are installed: `npm install`

### Frontend Build Issues
1. Run `npm install` in client folder
2. Check Node.js version: `node --version` (should be ^20.19.0 or >=22.12.0)
3. Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`

## Testing

### Frontend
```bash
cd client
npm run test
```

### Backend
```bash
cd backend
npm run test
```

## Production Deployment

### Frontend Build
```bash
cd client
npm run build
# Output: dist/
```

### Backend Build
```bash
cd backend
npm run build
npm run start:prod
```

### Environment Variables for Production
Update CORS_ORIGIN and API_URL to point to your production domains.

## Features

- ✅ Dashboard with income/expense summary
- ✅ Transaction management (CRUD)
- ✅ Account management
- ✅ Statistics and spending analysis
- ✅ Responsive Tailwind CSS design
- ✅ Type-safe API communication
- ✅ In-memory data storage (can be replaced with database)

## Future Enhancements

- [ ] Database integration (PostgreSQL + TypeORM/Prisma)
- [ ] User authentication
- [ ] Transaction categories customization
- [ ] Advanced filters and search
- [ ] Data export (CSV, PDF)
- [ ] Mobile application

## License
UNLICENSED
