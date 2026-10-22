import { Router } from 'express';
import { store } from '../data/store.js';

const router = Router();

// GET /api/alerts
router.get('/', (req, res) => {
  const alerts = [];

  for (const m of store.medicines) {
    if (m.status !== 'in_stock') {
      alerts.push({
        id: `alert-${m.id}`,
        type: m.status, // 'out_of_stock' | 'low_stock' | 'expiring_soon'
        medicineId: m.id,
        medicineName: m.name,
        genericName: m.genericName,
        strength: m.strength,
        currentStock: m.currentStock,
        minimumStock: m.minimumStock,
        expiryDate: m.expiryDate,
        createdAt: new Date().toISOString(),
      });
    }
  }

  res.json({
    success: true,
    count: alerts.length,
    data: alerts,
  });
});

export default router;
