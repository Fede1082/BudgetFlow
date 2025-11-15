# BudgetFlow -- Personal Budget Tracker

BudgetFlow is a full-stack budget management application designed to
help users track income, expenses, and spending categories with clarity
and ease.\
It features a modern dashboard, real-time analytics, and a fully
responsive mobile-first design.

> The goal: provide clear, automated, and accessible financial
> management for everyday users.

## 🚀 Features

-   User Authentication (MongoDB)
-   Dashboard Overview
    -   Monthly summary
    -   Category distribution
    -   Recent transactions
-   Income & Expense Tracking
-   Custom Categories
-   Advanced Filters & Search
-   Real-time Charts (Recharts)
-   Mobile-first UI (Vue)
-   AI-powered auto-categorization (optional feature)

## 🧰 Tech Stack

### Frontend

-   Vue.js 3
-   Vue Router
-   Pinia (State Management)
-   Tailwind CSS
-   Recharts

### Backend

-   Node.js + Express
-   JWT Authentication
-   REST API Architecture

### Database

-   MongoDB (Users & Auth)
-   PostgreSQL (Transactions, Categories, Stats)

### DevOps (optional)

-   Docker
-   GitHub Actions CI/CD
-   Deployment on AWS / Render / Vercel

## 📂 Project Structure

    BudgetFlow/
    │
    ├── client/               # Vue.js Frontend
    │   ├── src/
    │   ├── public/
    │   └── ...
    │
    ├── server/               # Node.js Backend
    │   ├── src/
    │   ├── routes/
    │   ├── controllers/
    │   ├── models/
    │   └── ...
    │
    └── README.md

## ⚙️ Setup Instructions

### 1. Clone the repository

    git clone https://github.com/your-username/BudgetFlow.git
    cd BudgetFlow

### 2. Install dependencies

#### Frontend:

    cd client
    npm install

#### Backend:

    cd ../server
    npm install

### 3. Environment Variables

Create a `.env` file inside `/server`:

    PORT=5000
    JWT_SECRET=your-secret-key
    MONGO_URI=your-mongodb-connection
    POSTGRES_URI=your-postgres-connection

### 4. Run the app

#### Backend:

    cd server
    npm run dev

#### Frontend:

    cd client
    npm run dev

App available at:\
`http://localhost:5173/`

## 📊 Screenshots (placeholders)

Add your own screenshots here:

    /assets/screenshots/dashboard.png
    /assets/screenshots/transactions.png

## 🗺️ Roadmap

-   [ ] Add recurring transactions\
-   [ ] Add multi-currency support\
-   [ ] Add PDF export for reports\
-   [ ] Add AI-based financial insights\
-   [ ] Add collaborative budgeting (shared accounts)

## 🤝 Contributing

Pull requests are welcome.\
For major changes, please open an issue first to discuss what you would
like to modify.

## 📄 License

MIT License -- free to use and modify.
