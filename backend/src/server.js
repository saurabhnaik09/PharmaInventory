import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import medicinesRouter from './routes/medicines.js';
import ordersRouter from './routes/orders.js';
import procurementRouter from './routes/procurement.js';
import alertsRouter from './routes/alerts.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// ─── Middleware ───────────────────────────────────────────────────────────────

app.use(
  cors({
    origin: CORS_ORIGIN === '*' ? '*' : [CORS_ORIGIN, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);

app.use(express.json());

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// ─── Routes ───────────────────────────────────────────────────────────────────

// Root info
app.get('/', (req, res) => {
  res.json({
    name: 'Pharma Inventory API',
    version: '1.0.0',
    status: 'online',
    endpoints: {
      health: '/api/health',
      medicines: '/api/medicines',
      medicineStats: '/api/medicines/stats',
      orders: '/api/orders',
      orderStats: '/api/orders/stats',
      procurementPharmacies: '/api/procurement/pharmacies',
      procurementSuppliers: '/api/procurement/suppliers',
      procurementSearch: '/api/procurement/search?q=:query',
      alerts: '/api/alerts',
    },
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Resource Routers
app.use('/api/medicines', medicinesRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/procurement', procurementRouter);
app.use('/api/alerts', alertsRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.url}` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`🚀 Pharma Inventory Backend running on http://localhost:${PORT}`);
  console.log(`📡 CORS enabled for origin: ${CORS_ORIGIN}`);
});
