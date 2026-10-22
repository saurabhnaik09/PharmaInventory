import { Router } from 'express';
import { store } from '../data/store.js';

const router = Router();

// GET /api/orders/stats
router.get('/stats', (req, res) => {
  const pending = store.orders.filter(o => o.status === 'pending').length;
  const processing = store.orders.filter(o =>
    ['accepted', 'processing', 'dispatched'].includes(o.status)
  ).length;
  const completed = store.orders.filter(o => o.status === 'completed').length;
  const total = store.orders.length;

  res.json({
    success: true,
    data: { pending, processing, completed, total },
  });
});

// GET /api/orders
router.get('/', (req, res) => {
  const { status, sourceType } = req.query;
  let result = [...store.orders];

  if (status && status !== 'All') {
    result = result.filter(o => o.status === status);
  }

  if (sourceType) {
    result = result.filter(o => o.sourceType === sourceType);
  }

  res.json({
    success: true,
    count: result.length,
    data: result,
  });
});

// GET /api/orders/:id
router.get('/:id', (req, res) => {
  const order = store.orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  res.json({ success: true, data: order });
});

// POST /api/orders
router.post('/', (req, res) => {
  const { medicineName, genericName, strength, sourceName, sourceType, quantity, note, unitPrice } =
    req.body;

  if (!medicineName || !sourceName || !sourceType || !quantity) {
    return res.status(400).json({
      success: false,
      message: 'Missing required order fields: medicineName, sourceName, sourceType, and quantity',
    });
  }

  const year = new Date().getFullYear();
  const seq = String(store.orders.length + 1).padStart(5, '0');
  const prefix = sourceType === 'pharmacy' ? 'REQ' : 'ORD';
  const id = `${prefix}-${year}-${seq}`;

  const qty = Number(quantity);
  const price = Number(unitPrice) || 0;

  const newOrder = {
    id,
    medicine: medicineName,
    genericName: genericName || medicineName,
    strength: strength || '',
    source: sourceName,
    sourceType,
    quantity: qty,
    date: new Date().toISOString(),
    status: 'pending',
    note: note || '',
    totalAmount: price * qty,
  };

  store.orders.unshift(newOrder);

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: newOrder,
  });
});

// PATCH /api/orders/:id/status
router.patch('/:id/status', (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'accepted', 'processing', 'dispatched', 'completed', 'rejected'];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
    });
  }

  const order = store.orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  order.status = status;
  res.json({
    success: true,
    message: `Order status updated to ${status}`,
    data: order,
  });
});

export default router;
