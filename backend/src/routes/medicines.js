import { Router } from 'express';
import { store, computeStockStatus } from '../data/store.js';

const router = Router();

// GET /api/medicines/stats
router.get('/stats', (req, res) => {
  const total = store.medicines.length;
  const lowStock = store.medicines.filter(m => m.status === 'low_stock').length;
  const expiringSoon = store.medicines.filter(m => m.status === 'expiring_soon').length;
  const outOfStock = store.medicines.filter(m => m.status === 'out_of_stock').length;

  res.json({
    success: true,
    data: { total, lowStock, expiringSoon, outOfStock },
  });
});

// GET /api/medicines
router.get('/', (req, res) => {
  const { search, category, status } = req.query;
  let result = [...store.medicines];

  if (search) {
    const q = search.toLowerCase().trim();
    result = result.filter(
      m =>
        m.name.toLowerCase().includes(q) ||
        m.genericName.toLowerCase().includes(q) ||
        m.batchNumber.toLowerCase().includes(q) ||
        m.supplier.toLowerCase().includes(q)
    );
  }

  if (category && category !== 'All') {
    result = result.filter(m => m.category === category);
  }

  if (status && status !== 'All') {
    result = result.filter(m => m.status === status);
  }

  res.json({
    success: true,
    count: result.length,
    data: result,
  });
});

// GET /api/medicines/:id
router.get('/:id', (req, res) => {
  const medicine = store.medicines.find(m => m.id === req.params.id);
  if (!medicine) {
    return res.status(404).json({ success: false, message: 'Medicine not found' });
  }
  res.json({ success: true, data: medicine });
});

// POST /api/medicines
router.post('/', (req, res) => {
  const {
    name,
    genericName,
    category,
    strength,
    dosageForm,
    batchNumber,
    currentStock,
    minimumStock,
    unitPrice,
    expiryDate,
    supplier,
  } = req.body;

  if (!name || !genericName || !expiryDate) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: name, genericName, and expiryDate are mandatory',
    });
  }

  const stock = Number(currentStock) || 0;
  const minStock = Number(minimumStock) || 10;
  const price = Number(unitPrice) || 0;
  const status = computeStockStatus(stock, minStock, expiryDate);

  const newMedicine = {
    id: `m${Date.now()}`,
    name,
    genericName,
    category: category || 'Other',
    strength: strength || '',
    dosageForm: dosageForm || 'Tablet',
    batchNumber: batchNumber || `BATCH-${Date.now()}`,
    currentStock: stock,
    minimumStock: minStock,
    unitPrice: price,
    expiryDate,
    supplier: supplier || 'Unassigned',
    status,
  };

  store.medicines.unshift(newMedicine);

  res.status(201).json({
    success: true,
    message: 'Medicine added successfully',
    data: newMedicine,
  });
});

// PUT /api/medicines/:id
router.put('/:id', (req, res) => {
  const idx = store.medicines.findIndex(m => m.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Medicine not found' });
  }

  const existing = store.medicines[idx];
  const updatedData = { ...existing, ...req.body };

  // Re-compute status if relevant fields changed
  updatedData.status = computeStockStatus(
    updatedData.currentStock,
    updatedData.minimumStock,
    updatedData.expiryDate
  );

  store.medicines[idx] = updatedData;

  res.json({
    success: true,
    message: 'Medicine updated successfully',
    data: updatedData,
  });
});

// DELETE /api/medicines/:id
router.delete('/:id', (req, res) => {
  const idx = store.medicines.findIndex(m => m.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Medicine not found' });
  }

  const deleted = store.medicines.splice(idx, 1)[0];
  res.json({
    success: true,
    message: 'Medicine deleted successfully',
    data: deleted,
  });
});

export default router;
