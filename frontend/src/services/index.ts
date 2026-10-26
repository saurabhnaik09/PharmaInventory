// Services layer — all data access goes through here.
// Mock implementation; swap internals for real API calls without touching components.

import { mockMedicines } from '../data/mock/medicines';
import { mockPharmacies, mockSuppliers } from '../data/mock/sources';
import { mockOrders } from '../data/mock/orders';
import type {
  Medicine,
  Pharmacy,
  Supplier,
  SupplierMedicineAvailability,
  Order,
  OrderStatus,
  Alert,
  ProcurementResult,
  AddMedicineForm,
  OrderSourceType,
} from '../types';
import { computeStockStatus, generateOrderId, stockStatusToAlertType } from '../utils';

// ─── Internal mutable state ───────────────────────────────────────────────────

let _medicines: Medicine[] = [...mockMedicines];
let _orders: Order[] = [...mockOrders];
let _suppliers: Supplier[] = JSON.parse(JSON.stringify(mockSuppliers));

// ─── Medicine Service ─────────────────────────────────────────────────────────

export const MedicineService = {
  getAll(): Medicine[] {
    return _medicines;
  },

  getById(id: string): Medicine | undefined {
    return _medicines.find(m => m.id === id);
  },

  add(form: AddMedicineForm): Medicine {
    const newMed: Medicine = {
      id: `m${Date.now()}`,
      ...form,
      status: computeStockStatus(form.currentStock, form.minimumStock, form.expiryDate),
    };
    _medicines = [newMed, ..._medicines];
    return newMed;
  },

  update(id: string, updates: Partial<Medicine>): Medicine | null {
    const idx = _medicines.findIndex(m => m.id === id);
    if (idx === -1) return null;
    const updated = {
      ..._medicines[idx],
      ...updates,
      status: computeStockStatus(
        updates.currentStock ?? _medicines[idx].currentStock,
        updates.minimumStock ?? _medicines[idx].minimumStock,
        updates.expiryDate ?? _medicines[idx].expiryDate
      ),
    };
    _medicines = _medicines.map(m => (m.id === id ? updated : m));
    return updated;
  },

  delete(id: string): boolean {
    const before = _medicines.length;
    _medicines = _medicines.filter(m => m.id !== id);
    return _medicines.length < before;
  },

  getStats() {
    const total = _medicines.length;
    const lowStock = _medicines.filter(m => m.status === 'low_stock').length;
    const expiringSoon = _medicines.filter(m => m.status === 'expiring_soon').length;
    const outOfStock = _medicines.filter(m => m.status === 'out_of_stock').length;
    return { total, lowStock, expiringSoon, outOfStock };
  },
};

// ─── Alert Service ────────────────────────────────────────────────────────────

export const AlertService = {
  getAll(): Alert[] {
    const alerts: Alert[] = [];
    for (const m of _medicines) {
      const alertType = stockStatusToAlertType(m.status);
      if (alertType) {
        alerts.push({
          id: `alert-${m.id}`,
          type: alertType,
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
    return alerts;
  },
};

// ─── Procurement Service ──────────────────────────────────────────────────────

export const ProcurementService = {
  getPharmacies(): Pharmacy[] {
    return mockPharmacies;
  },

  getSuppliers(): Supplier[] {
    return _suppliers;
  },

  search(query: string): ProcurementResult[] {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    const results: ProcurementResult[] = [];

    for (const pharmacy of mockPharmacies) {
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

    for (const supplier of _suppliers) {
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

    return results.sort((a, b) => {
      if (a.sourceType === 'pharmacy' && b.sourceType === 'supplier') return -1;
      if (a.sourceType === 'supplier' && b.sourceType === 'pharmacy') return 1;
      return (a.distance ?? 999) - (b.distance ?? 999);
    });
  },
};

// ─── Supplier Catalog Service ────────────────────────────────────────────────

export const SupplierCatalogService = {
  getSupplier(supplierId = 's1'): Supplier | undefined {
    return _suppliers.find(s => s.id === supplierId);
  },

  getMedicines(supplierId = 's1'): SupplierMedicineAvailability[] {
    const s = _suppliers.find(s => s.id === supplierId);
    return s ? [...s.availableMedicines] : [];
  },

  updateStock(supplierId: string, medicineId: string, availableQty: number, unitPrice?: number): boolean {
    const s = _suppliers.find(s => s.id === supplierId);
    if (!s) return false;
    const med = s.availableMedicines.find(m => m.medicineId === medicineId);
    if (!med) return false;
    med.availableQty = Math.max(0, availableQty);
    if (unitPrice !== undefined && unitPrice > 0) med.unitPrice = unitPrice;
    return true;
  },

  addProduct(supplierId: string, product: SupplierMedicineAvailability): void {
    const s = _suppliers.find(s => s.id === supplierId);
    if (!s) return;
    s.availableMedicines = [product, ...s.availableMedicines];
  },

  deleteProduct(supplierId: string, medicineId: string): boolean {
    const s = _suppliers.find(s => s.id === supplierId);
    if (!s) return false;
    const lenBefore = s.availableMedicines.length;
    s.availableMedicines = s.availableMedicines.filter(m => m.medicineId !== medicineId);
    return s.availableMedicines.length < lenBefore;
  },
};

// ─── Order Service ────────────────────────────────────────────────────────────

export const OrderService = {
  getAll(): Order[] {
    return _orders;
  },

  getById(id: string): Order | undefined {
    return _orders.find(o => o.id === id);
  },

  createRequest(params: {
    medicineName: string;
    genericName: string;
    strength: string;
    sourceName: string;
    sourceType: OrderSourceType;
    quantity: number;
    note?: string;
    unitPrice: number;
  }): Order {
    const id = generateOrderId(params.sourceType);
    const order: Order = {
      id,
      medicine: params.medicineName,
      genericName: params.genericName,
      strength: params.strength,
      source: params.sourceName,
      sourceType: params.sourceType,
      quantity: params.quantity,
      date: new Date().toISOString(),
      status: 'pending',
      note: params.note,
      totalAmount: params.unitPrice * params.quantity,
      pharmacyName: 'ABC Pharmacy',
      pharmacyAddress: 'Plot 42, Health City, Andheri East, Mumbai',
      contactPhone: '+91 98200 12345',
    };
    _orders = [order, ..._orders];
    return order;
  },

  updateStatus(
    id: string,
    status: OrderStatus,
    details?: {
      trackingNumber?: string;
      courierName?: string;
      note?: string;
      rejectionReason?: string;
      estimatedDeliveryDate?: string;
    }
  ): Order | null {
    const idx = _orders.findIndex(o => o.id === id);
    if (idx === -1) return null;
    const now = new Date().toISOString();
    const existing = _orders[idx];
    const updated: Order = {
      ...existing,
      status,
      ...(details?.trackingNumber ? { trackingNumber: details.trackingNumber } : {}),
      ...(details?.courierName ? { courierName: details.courierName } : {}),
      ...(details?.note ? { note: details.note } : {}),
      ...(details?.rejectionReason ? { rejectionReason: details.rejectionReason } : {}),
      ...(details?.estimatedDeliveryDate ? { estimatedDeliveryDate: details.estimatedDeliveryDate } : {}),
      ...(status === 'accepted' ? { acceptedAt: now } : {}),
      ...(status === 'dispatched' ? { dispatchedAt: now } : {}),
      ...(status === 'completed' ? { completedAt: now } : {}),
    };
    _orders = _orders.map(o => (o.id === id ? updated : o));

    // When order is completed, automatically replenish matching medicine in pharmacy stock if exists
    if (status === 'completed') {
      const matchMed = _medicines.find(
        m => m.name.toLowerCase() === existing.medicine.toLowerCase() ||
             m.genericName.toLowerCase() === existing.genericName.toLowerCase()
      );
      if (matchMed) {
        MedicineService.update(matchMed.id, {
          currentStock: matchMed.currentStock + existing.quantity,
        });
      }
    }

    return updated;
  },

  getStats() {
    const pending = _orders.filter(o => o.status === 'pending').length;
    const processing = _orders.filter(o => ['accepted', 'processing', 'dispatched'].includes(o.status)).length;
    return { pending, processing, total: _orders.length };
  },
};

