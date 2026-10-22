# 🏥 Pharma Inventory Management System

A full-stack pharmaceutical inventory and inter-store procurement platform organized cleanly into three distinct tiers: **Frontend**, **Backend**, and **Database**.

---

## 📁 Project Architecture & Folder Breakdown

The project is structured into three primary folders so you can easily identify, locate, and develop each part of the system:

```
Pharma-Inventory/
│
├── 📁 frontend/              # User Interface & Client Application
│   ├── src/                 # React 19 + TypeScript components, pages & logic
│   │   ├── components/      # UI components (modals, tables, cards, stat badges)
│   │   ├── context/         # Auth & Theme state providers
│   │   ├── data/mock/       # Client-side fallback datasets
│   │   ├── layouts/         # App dashboard layout & sidebar navigation
│   │   ├── pages/           # Views (Dashboard, Inventory, Procurement, Orders, Alerts, Settings)
│   │   ├── services/        # Frontend API client & data services
│   │   ├── types/           # Domain TypeScript type definitions
│   │   └── utils/           # Stock status algorithms & helpers
│   ├── public/              # Static files & assets
│   ├── vite.config.ts       # Vite config with API proxy to localhost:5000
│   ├── index.html           # Single page entry HTML
│   └── package.json         # Frontend dependencies & scripts
│
├── 📁 backend/               # RESTful API Server
│   ├── src/
│   │   ├── data/            # In-memory data store with live state & stock logic
│   │   ├── routes/          # Express route controllers
│   │   │   ├── medicines.js # CRUD & statistics for inventory medicines
│   │   │   ├── orders.js    # Order processing, status updates & stats
│   │   │   ├── procurement.js # Inter-pharmacy & supplier catalog queries
│   │   │   └── alerts.js    # Stock & expiration alert generation
│   │   └── server.js        # Express app entrypoint (Port 5000)
│   ├── .env.example         # Environment variables template
│   ├── .env                 # Active local environment variables
│   └── package.json         # Backend dependencies (express, cors, dotenv)
│
├── 📁 database/              # Database Schemas & Seeds
│   ├── schema.sql           # ANSI SQL schema (medicines, orders, pharmacies, suppliers, alerts, users)
│   ├── seeds.sql            # Seed dataset with realistic pharmaceutical records
│   └── README.md            # ER diagrams & DB import guides (SQLite, PostgreSQL, MySQL)
│
├── netlify.toml             # Netlify deployment configuration
└── package.json             # Root workspace coordination scripts
```

---

## ⚡ Quick Start Guide

### 1. Install Dependencies
You can install dependencies for both frontend and backend in one command:
```bash
npm run install:all
```
*(Or install inside each folder individually: `cd frontend && npm install`, `cd backend && npm install`)*

---

### 2. Running the Applications

#### Option A: Run Both Together (Recommended)
Open two terminal tabs:
- **Terminal 1 (Backend API):**
  ```bash
  npm run dev:backend
  ```
  *(Server runs at `http://localhost:5000`)*

- **Terminal 2 (Frontend Client):**
  ```bash
  npm run dev:frontend
  ```
  *(Vite dev server opens at `http://localhost:5173`)*

#### Option B: Run Frontend Only
```bash
npm run dev
```

---

## 🌐 API Overview

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | `GET` | Health check endpoint |
| `/api/medicines` | `GET`, `POST` | List & filter medicines or add new medicine |
| `/api/medicines/stats` | `GET` | Inventory statistics (total, low stock, expiring, out of stock) |
| `/api/medicines/:id` | `GET`, `PUT`, `DELETE` | View, update, or delete single medicine |
| `/api/orders` | `GET`, `POST` | List orders or create new procurement order |
| `/api/orders/stats` | `GET` | Order metrics (pending, processing, completed) |
| `/api/orders/:id/status` | `PATCH` | Update order fulfillment status |
| `/api/procurement/search`| `GET` | Search matching stock across pharmacies and suppliers |
| `/api/alerts` | `GET` | Dynamic stock and expiration alerts |

---

## 🗄️ Database Setup

To load the database schema and seed data into a database of your choice:

- **SQLite**:
  ```bash
  cd database
  sqlite3 pharma.db < schema.sql
  sqlite3 pharma.db < seeds.sql
  ```
- **PostgreSQL**:
  ```bash
  cd database
  psql -U postgres -d pharma_inventory -f schema.sql
  psql -U postgres -d pharma_inventory -f seeds.sql
  ```
- **MySQL**:
  ```bash
  cd database
  mysql -u root -p pharma_inventory < schema.sql
  mysql -u root -p pharma_inventory < seeds.sql
  ```
