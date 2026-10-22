# 🎨 Pharma Inventory — Frontend Client Layer

A modern, responsive React + TypeScript Single Page Application (SPA) built with Vite and TailwindCSS for managing pharmacy inventory, inter-store procurement, stock alerts, and orders.

---

## 📂 Architecture

```
frontend/
├── src/
│   ├── assets/              # Icons, images, and static graphics
│   ├── components/          # Reusable UI widgets, modals, cards, badges, and layout components
│   ├── context/             # Global React Context providers (Auth, Theme, etc.)
│   ├── data/mock/           # Local mock fallback dataset (medicines, sources, orders)
│   ├── layouts/             # Dashboard shell and navigation wrappers
│   ├── pages/               # Application view routes:
│   │   ├── DashboardPage.tsx
│   │   ├── InventoryPage.tsx
│   │   ├── ProcurementPage.tsx
│   │   ├── OrdersPage.tsx
│   │   ├── AlertsPage.tsx
│   │   ├── SettingsPage.tsx
│   │   └── LandingPage.tsx
│   ├── services/            # Client data services connecting to backend API & state
│   ├── types/               # TypeScript interfaces and domain models
│   ├── utils/               # Formatting, stock status computations, and ID generators
│   ├── App.tsx              # Root router configuration
│   ├── main.tsx             # React entrypoint
│   └── index.css            # Global Tailwind styling & theme variables
├── public/                  # Static assets served as-is
├── index.html               # Main HTML document template
├── vite.config.ts           # Vite bundler configuration & /api proxy to backend
├── tsconfig.json            # TypeScript configuration
└── package.json             # Frontend dependencies & scripts
```

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Start the development server
```bash
npm run dev
```

The app will be accessible at: **`http://localhost:5173`**
API requests directed to `/api/*` are automatically proxied to the backend at `http://localhost:5000`.

### 3. Build for production
```bash
npm run build
```
Generates production-optimized assets in `dist/`.
