# 🚀 Pharma Inventory — Backend API Layer

A Node.js & Express RESTful API powering the Pharma Inventory Management System.

---

## 📂 Architecture

```
backend/
├── src/
│   ├── data/
│   │   └── store.js         # In-memory data store with live state & stock status compute
│   ├── routes/
│   │   ├── alerts.js        # GET /api/alerts
│   │   ├── medicines.js     # CRUD & stats for medicines inventory
│   │   ├── orders.js        # Order creation, status updates & stats
│   │   └── procurement.js   # Inter-store & supplier search
│   └── server.js            # Express app configuration & server entrypoint
├── .env.example             # Environment variables template
├── .env                     # Local environment file
└── package.json             # Backend dependencies & npm scripts
```

---

## 🛠️ API Endpoints

### 1. Health
- `GET /api/health` — Check server health.

### 2. Medicines Inventory
- `GET /api/medicines` — Retrieve all medicines (Supports `?search=`, `?category=`, `?status=`).
- `GET /api/medicines/stats` — Summary counts (total, lowStock, expiringSoon, outOfStock).
- `GET /api/medicines/:id` — Get single medicine details.
- `POST /api/medicines` — Add new medicine to inventory.
- `PUT /api/medicines/:id` — Update medicine details or stock level.
- `DELETE /api/medicines/:id` — Remove medicine from inventory.

### 3. Orders & Requests
- `GET /api/orders` — List orders (Supports `?status=`, `?sourceType=`).
- `GET /api/orders/stats` — Summary counts (pending, processing, completed, total).
- `GET /api/orders/:id` — Get order by ID.
- `POST /api/orders` — Place order or inter-pharmacy request.
- `PATCH /api/orders/:id/status` — Update order status (`pending`, `accepted`, `processing`, `dispatched`, `completed`, `rejected`).

### 4. Procurement & Inter-Store Search
- `GET /api/procurement/pharmacies` — List partner pharmacies with stock.
- `GET /api/procurement/suppliers` — List certified suppliers with catalog.
- `GET /api/procurement/search?q=:query` — Search across nearby pharmacies and suppliers.

### 5. Alerts
- `GET /api/alerts` — Real-time computed stock alerts (`low_stock`, `out_of_stock`, `expiring_soon`).

---

## 🏃 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Start the development server
```bash
npm run dev
```

The server starts on `http://localhost:5000` with automatic reloading enabled.
