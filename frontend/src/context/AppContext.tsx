import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Medicine, Order, Alert, OrderStatus, SupplierMedicineAvailability } from '../types';
import { MedicineService, AlertService, OrderService, SupplierCatalogService } from '../services';

// ─── App State Context ────────────────────────────────────────────────────────

interface AppState {
  medicines: Medicine[];
  orders: Order[];
  alerts: Alert[];
  supplierMedicines: SupplierMedicineAvailability[];
  addMedicine: (form: Parameters<typeof MedicineService.add>[0]) => Medicine;
  createOrder: (params: Parameters<typeof OrderService.createRequest>[0]) => Order;
  updateOrderStatus: (
    id: string,
    status: OrderStatus,
    details?: {
      trackingNumber?: string;
      courierName?: string;
      note?: string;
      rejectionReason?: string;
      estimatedDeliveryDate?: string;
    }
  ) => Order | null;
  updateSupplierStock: (supplierId: string, medicineId: string, availableQty: number, unitPrice?: number) => void;
  addSupplierProduct: (supplierId: string, product: SupplierMedicineAvailability) => void;
  refreshAll: () => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [medicines, setMedicines] = useState<Medicine[]>(() => MedicineService.getAll());
  const [orders, setOrders] = useState<Order[]>(() => OrderService.getAll());
  const [alerts, setAlerts] = useState<Alert[]>(() => AlertService.getAll());
  const [supplierMedicines, setSupplierMedicines] = useState<SupplierMedicineAvailability[]>(() =>
    SupplierCatalogService.getMedicines('s1')
  );

  const refreshAll = useCallback(() => {
    setMedicines(MedicineService.getAll());
    setOrders(OrderService.getAll());
    setAlerts(AlertService.getAll());
    setSupplierMedicines(SupplierCatalogService.getMedicines('s1'));
  }, []);

  const addMedicine = useCallback((form: Parameters<typeof MedicineService.add>[0]) => {
    const med = MedicineService.add(form);
    setMedicines(MedicineService.getAll());
    setAlerts(AlertService.getAll());
    return med;
  }, []);

  const createOrder = useCallback((params: Parameters<typeof OrderService.createRequest>[0]) => {
    const order = OrderService.createRequest(params);
    setOrders(OrderService.getAll());
    return order;
  }, []);

  const updateOrderStatus = useCallback(
    (
      id: string,
      status: OrderStatus,
      details?: {
        trackingNumber?: string;
        courierName?: string;
        note?: string;
        rejectionReason?: string;
        estimatedDeliveryDate?: string;
      }
    ) => {
      const updated = OrderService.updateStatus(id, status, details);
      setOrders([...OrderService.getAll()]);
      if (status === 'completed') {
        setMedicines([...MedicineService.getAll()]);
        setAlerts([...AlertService.getAll()]);
      }
      return updated;
    },
    []
  );

  const updateSupplierStock = useCallback(
    (supplierId: string, medicineId: string, availableQty: number, unitPrice?: number) => {
      SupplierCatalogService.updateStock(supplierId, medicineId, availableQty, unitPrice);
      setSupplierMedicines([...SupplierCatalogService.getMedicines(supplierId)]);
    },
    []
  );

  const addSupplierProduct = useCallback(
    (supplierId: string, product: SupplierMedicineAvailability) => {
      SupplierCatalogService.addProduct(supplierId, product);
      setSupplierMedicines([...SupplierCatalogService.getMedicines(supplierId)]);
    },
    []
  );

  return (
    <AppContext.Provider
      value={{
        medicines,
        orders,
        alerts,
        supplierMedicines,
        addMedicine,
        createOrder,
        updateOrderStatus,
        updateSupplierStock,
        addSupplierProduct,
        refreshAll,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}


export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppState must be used within AppProvider');
  return ctx;
}
