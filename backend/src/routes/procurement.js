import { Router } from 'express';
import { store } from '../data/store.js';

const router = Router();

// GET /api/procurement/pharmacies
router.get('/pharmacies', (req, res) => {
  res.json({
    success: true,
    count: store.pharmacies.length,
    data: store.pharmacies,
  });
});

// GET /api/procurement/suppliers
router.get('/suppliers', (req, res) => {
  res.json({
    success: true,
    count: store.suppliers.length,
    data: store.suppliers,
  });
});

// GET /api/procurement/search?q=...
router.get('/search', (req, res) => {
  const query = req.query.q || '';
  if (!query.trim()) {
    return res.json({ success: true, count: 0, data: [] });
  }

  const q = query.toLowerCase().trim();
  const results = [];

  // Search across partner pharmacies
  for (const pharmacy of store.pharmacies) {
    for (const med of pharmacy.availableMedicines) {
      if (
        med.medicineName.toLowerCase().includes(q) ||
        med.genericName.toLowerCase().includes(q)
      ) {
        results.push({
          sourceType: 'pharmacy',
          sourceId: pharmacy.id,
          sourceName: pharmacy.name,
          city: pharmacy.city,
          distance: pharmacy.distance,
          medicineName: med.medicineName,
          genericName: med.genericName,
          strength: med.strength,
          dosageForm: med.dosageForm,
          availableQty: med.availableQty,
          unitPrice: med.unitPrice,
          rating: pharmacy.rating,
        });
      }
    }
  }

  // Search across suppliers
  for (const supplier of store.suppliers) {
    for (const med of supplier.availableMedicines) {
      if (
        med.medicineName.toLowerCase().includes(q) ||
        med.genericName.toLowerCase().includes(q)
      ) {
        results.push({
          sourceType: 'supplier',
          sourceId: supplier.id,
          sourceName: supplier.name,
          city: supplier.city,
          estimatedDelivery: supplier.estimatedDelivery,
          minimumOrderQuantity: supplier.minimumOrderQuantity,
          medicineName: med.medicineName,
          genericName: med.genericName,
          strength: med.strength,
          dosageForm: med.dosageForm,
          availableQty: med.availableQty,
          unitPrice: med.unitPrice,
          rating: supplier.rating,
        });
      }
    }
  }

  // Sort: pharmacies first by nearest distance, then suppliers
  results.sort((a, b) => {
    if (a.sourceType === 'pharmacy' && b.sourceType === 'supplier') return -1;
    if (a.sourceType === 'supplier' && b.sourceType === 'pharmacy') return 1;
    return (a.distance ?? 999) - (b.distance ?? 999);
  });

  res.json({
    success: true,
    count: results.length,
    data: results,
  });
});

export default router;
