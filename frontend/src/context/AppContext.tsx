import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Medicine, Order, Alert } from '../types';
import { MedicineService, AlertService, OrderService } from '../services';

// ─── App State Context ────────────────────────────────────────────────────────

interface AppState {
  medicines: Medicine[];
  orders: Order[];
  alerts: Alert[];
  addMedicine: (form: Parameters<typeof MedicineService.add>[0]) => Medicine;
  createOrder: (params: Parameters<typeof OrderService.createRequest>[0]) => Order;
  refreshAll: () => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [medicines, setMedicines] = useState<Medicine[]>(() => MedicineService.getAll());
  const [orders, setOrders] = useState<Order[]>(() => OrderService.getAll());
  const [alerts, setAlerts] = useState<Alert[]>(() => AlertService.getAll());

  const refreshAll = useCallback(() => {
    setMedicines(MedicineService.getAll());
    setOrders(OrderService.getAll());
    setAlerts(AlertService.getAll());
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

  return (
    <AppContext.Provider value={{ medicines, orders, alerts, addMedicine, createOrder, refreshAll }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppState must be used within AppProvider');
  return ctx;
}
