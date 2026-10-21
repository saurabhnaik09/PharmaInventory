// ─── Shared TypeScript Interfaces ───────────────────────────────────────────

export type UserRole = 'pharmacy' | 'supplier';

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'expiring_soon';

export type OrderStatus =
  | 'pending'
  | 'accepted'
  | 'processing'
  | 'dispatched'
  | 'completed'
  | 'rejected';

export type OrderSourceType = 'pharmacy' | 'supplier';

export type DosageForm =
  | 'Tablet'
  | 'Capsule'
  | 'Syrup'
  | 'Injection'
  | 'Cream'
  | 'Drops'
  | 'Inhaler'
  | 'Patch';

export type MedicineCategory =
  | 'Antibiotic'
  | 'Analgesic'
  | 'Antihistamine'
  | 'Antacid'
  | 'Antidiabetic'
  | 'Antihypertensive'
  | 'Antipyretic'
  | 'Antiviral'
  | 'Vitamin'
  | 'Cardiovascular'
  | 'Other';

// ─── Medicine ────────────────────────────────────────────────────────────────

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: MedicineCategory;
  strength: string;
  dosageForm: DosageForm;
  batchNumber: string;
  currentStock: number;
  minimumStock: number;
  unitPrice: number;
  expiryDate: string; // ISO date string
  supplier: string;
  status: StockStatus;
}

// ─── Pharmacy ────────────────────────────────────────────────────────────────

export interface PharmacyMedicineAvailability {
  medicineId: string;
  medicineName: string;
  genericName: string;
  strength: string;
  dosageForm: DosageForm;
  availableQty: number;
  unitPrice: number;
}

export interface Pharmacy {
  id: string;
  name: string;
  city: string;
  address: string;
  distance: number; // in km
  availableMedicines: PharmacyMedicineAvailability[];
  rating: number;
  contactPhone: string;
}

// ─── Supplier ────────────────────────────────────────────────────────────────

export interface SupplierMedicineAvailability {
  medicineId: string;
  medicineName: string;
  genericName: string;
  strength: string;
  dosageForm: DosageForm;
  availableQty: number;
  unitPrice: number;
}

export interface Supplier {
  id: string;
  name: string;
  city: string;
  address: string;
  availableMedicines: SupplierMedicineAvailability[];
  estimatedDelivery: string; // e.g. "1-2 days"
  minimumOrderQuantity: number;
  rating: number;
}

// ─── Procurement ─────────────────────────────────────────────────────────────

export interface ProcurementResult {
  sourceType: OrderSourceType;
  sourceId: string;
  sourceName: string;
  city: string;
  distance?: number; // only for pharmacies
  estimatedDelivery?: string; // only for suppliers
  minimumOrderQuantity?: number; // only for suppliers
  medicineName: string;
  genericName: string;
  strength: string;
  dosageForm: DosageForm;
  availableQty: number;
  unitPrice: number;
  rating: number;
}

// ─── Order ───────────────────────────────────────────────────────────────────

export interface Order {
  id: string;
  medicine: string;
  genericName: string;
  strength: string;
  source: string;
  sourceType: OrderSourceType;
  quantity: number;
  date: string; // ISO date string
  status: OrderStatus;
  note?: string;
  totalAmount?: number;
}

// ─── Alert ───────────────────────────────────────────────────────────────────

export type AlertType = 'low_stock' | 'out_of_stock' | 'expiring_soon';

export interface Alert {
  id: string;
  type: AlertType;
  medicineId: string;
  medicineName: string;
  genericName: string;
  strength: string;
  currentStock: number;
  minimumStock?: number;
  expiryDate?: string;
  createdAt: string;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  licenseNumber: string;
  city: string;
}

// ─── Forms ───────────────────────────────────────────────────────────────────

export interface AddMedicineForm {
  name: string;
  genericName: string;
  category: MedicineCategory;
  strength: string;
  dosageForm: DosageForm;
  batchNumber: string;
  currentStock: number;
  minimumStock: number;
  unitPrice: number;
  expiryDate: string;
  supplier: string;
}
