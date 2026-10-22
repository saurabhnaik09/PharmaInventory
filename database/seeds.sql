-- ============================================================================
-- Pharma Inventory Seed Data
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Users
-- ----------------------------------------------------------------------------
INSERT INTO users (id, role, name, email, license_number, city) VALUES
('u1', 'pharmacy', 'Arogya Medico Store', 'admin@arogyamed.com', 'PHARM-MH-2024-8831', 'Mumbai'),
('u2', 'supplier', 'MedSupply Distributors', 'orders@medsupply.com', 'DIST-MH-2023-1104', 'Mumbai');

-- ----------------------------------------------------------------------------
-- 2. Medicines (Inventory)
-- ----------------------------------------------------------------------------
INSERT INTO medicines (id, name, generic_name, category, strength, dosage_form, batch_number, current_stock, minimum_stock, unit_price, expiry_date, supplier, status) VALUES
('m1', 'Paracetamol 500mg', 'Paracetamol', 'Analgesic', '500mg', 'Tablet', 'PCM-2024-001', 450, 50, 1.20, '2026-12-31', 'MedSupply Distributors', 'in_stock'),
('m2', 'Azithromycin 500mg', 'Azithromycin', 'Antibiotic', '500mg', 'Tablet', 'AZI-2024-007', 0, 30, 45.00, '2026-08-31', 'PharmaBridge Ltd', 'out_of_stock'),
('m3', 'Amoxicillin 500mg', 'Amoxicillin', 'Antibiotic', '500mg', 'Capsule', 'AMX-2024-003', 15, 40, 12.50, '2026-11-30', 'HealthCore Pharma', 'low_stock'),
('m4', 'Cetirizine 10mg', 'Cetirizine', 'Antihistamine', '10mg', 'Tablet', 'CTZ-2024-012', 220, 30, 3.80, '2026-12-26', 'MedSupply Distributors', 'expiring_soon'),
('m5', 'Pantoprazole 40mg', 'Pantoprazole', 'Antacid', '40mg', 'Tablet', 'PNT-2024-005', 320, 50, 8.50, '2027-03-15', 'PharmaBridge Ltd', 'in_stock'),
('m6', 'Metformin 500mg', 'Metformin', 'Antidiabetic', '500mg', 'Tablet', 'MTF-2024-009', 25, 60, 4.20, '2027-01-20', 'HealthCore Pharma', 'low_stock'),
('m7', 'Amlodipine 5mg', 'Amlodipine', 'Cardiovascular', '5mg', 'Tablet', 'AML-2024-002', 180, 40, 6.75, '2027-05-10', 'MedSupply Distributors', 'in_stock'),
('m8', 'Atorvastatin 10mg', 'Atorvastatin', 'Cardiovascular', '10mg', 'Tablet', 'ATV-2024-011', 0, 30, 18.00, '2026-09-30', 'PharmaBridge Ltd', 'out_of_stock'),
('m9', 'Omeprazole 20mg', 'Omeprazole', 'Antacid', '20mg', 'Capsule', 'OME-2024-006', 95, 25, 5.50, '2027-02-28', 'HealthCore Pharma', 'in_stock'),
('m10', 'Doxycycline 100mg', 'Doxycycline', 'Antibiotic', '100mg', 'Capsule', 'DOX-2024-008', 8, 20, 28.00, '2027-04-15', 'MedSupply Distributors', 'low_stock'),
('m11', 'Salbutamol Inhaler', 'Salbutamol', 'Other', '100mcg', 'Inhaler', 'SAL-2024-004', 35, 10, 120.00, '2026-12-15', 'PharmaBridge Ltd', 'expiring_soon'),
('m12', 'Vitamin D3 60000 IU', 'Cholecalciferol', 'Vitamin', '60000 IU', 'Capsule', 'VTD-2024-010', 500, 100, 22.00, '2027-06-30', 'HealthCore Pharma', 'in_stock');

-- ----------------------------------------------------------------------------
-- 3. Pharmacies
-- ----------------------------------------------------------------------------
INSERT INTO pharmacies (id, name, city, address, distance, rating, contact_phone) VALUES
('ph1', 'City Center Pharmacy', 'Mumbai', '12 Marine Drive, Mumbai - 400001', 3.20, 4.7, '+91 98765 43210'),
('ph2', 'Wellness MedStore', 'Mumbai', '45 Linking Road, Bandra, Mumbai - 400050', 5.80, 4.3, '+91 87654 32109'),
('ph3', 'Lifeline Pharmacy', 'Mumbai', '8 Andheri West, Mumbai - 400053', 9.10, 4.5, '+91 76543 21098'),
('ph4', 'MedPlus Dadar', 'Mumbai', '22 Gokhale Road, Dadar, Mumbai - 400028', 6.40, 4.1, '+91 65432 10987');

-- ----------------------------------------------------------------------------
-- 4. Pharmacy Medicines
-- ----------------------------------------------------------------------------
INSERT INTO pharmacy_medicines (id, pharmacy_id, medicine_name, generic_name, strength, dosage_form, available_qty, unit_price) VALUES
('pm1', 'ph1', 'Azithromycin 500mg', 'Azithromycin', '500mg', 'Tablet', 120, 44.00),
('pm2', 'ph1', 'Amoxicillin 500mg', 'Amoxicillin', '500mg', 'Capsule', 80, 11.50),
('pm3', 'ph1', 'Metformin 500mg', 'Metformin', '500mg', 'Tablet', 200, 4.00),
('pm4', 'ph1', 'Atorvastatin 10mg', 'Atorvastatin', '10mg', 'Tablet', 150, 17.50),
('pm5', 'ph2', 'Azithromycin 500mg', 'Azithromycin', '500mg', 'Tablet', 60, 45.00),
('pm6', 'ph2', 'Doxycycline 100mg', 'Doxycycline', '100mg', 'Capsule', 40, 27.00),
('pm7', 'ph2', 'Cetirizine 10mg', 'Cetirizine', '10mg', 'Tablet', 300, 3.50),
('pm8', 'ph3', 'Azithromycin 500mg', 'Azithromycin', '500mg', 'Tablet', 45, 46.00),
('pm9', 'ph3', 'Pantoprazole 40mg', 'Pantoprazole', '40mg', 'Tablet', 180, 8.00),
('pm10', 'ph4', 'Atorvastatin 10mg', 'Atorvastatin', '10mg', 'Tablet', 90, 17.00),
('pm11', 'ph4', 'Amlodipine 5mg', 'Amlodipine', '5mg', 'Tablet', 120, 6.50);

-- ----------------------------------------------------------------------------
-- 5. Suppliers
-- ----------------------------------------------------------------------------
INSERT INTO suppliers (id, name, city, address, estimated_delivery, minimum_order_quantity, rating) VALUES
('s1', 'MedSupply Distributors', 'Mumbai', 'MIDC Industrial Area, Andheri East, Mumbai - 400093', '1-2 days', 20, 4.8),
('s2', 'PharmaBridge Ltd', 'Pune', 'Hinjewadi Phase 2, Pune - 411057', '2-3 days', 50, 4.5),
('s3', 'HealthCore Pharma', 'Thane', 'Wagle Industrial Estate, Thane - 400604', '1-2 days', 30, 4.6);

-- ----------------------------------------------------------------------------
-- 6. Supplier Medicines
-- ----------------------------------------------------------------------------
INSERT INTO supplier_medicines (id, supplier_id, medicine_name, generic_name, strength, dosage_form, available_qty, unit_price) VALUES
('sm1', 's1', 'Azithromycin 500mg', 'Azithromycin', '500mg', 'Tablet', 500, 42.00),
('sm2', 's1', 'Paracetamol 500mg', 'Paracetamol', '500mg', 'Tablet', 5000, 1.00),
('sm3', 's1', 'Amoxicillin 500mg', 'Amoxicillin', '500mg', 'Capsule', 1000, 10.50),
('sm4', 's1', 'Cetirizine 10mg', 'Cetirizine', '10mg', 'Tablet', 2000, 3.20),
('sm5', 's1', 'Atorvastatin 10mg', 'Atorvastatin', '10mg', 'Tablet', 800, 16.00),
('sm6', 's2', 'Azithromycin 500mg', 'Azithromycin', '500mg', 'Tablet', 300, 40.00),
('sm7', 's2', 'Doxycycline 100mg', 'Doxycycline', '100mg', 'Capsule', 500, 25.00),
('sm8', 's2', 'Metformin 500mg', 'Metformin', '500mg', 'Tablet', 2000, 3.80),
('sm9', 's3', 'Azithromycin 500mg', 'Azithromycin', '500mg', 'Tablet', 200, 41.50),
('sm10', 's3', 'Pantoprazole 40mg', 'Pantoprazole', '40mg', 'Tablet', 1500, 7.50),
('sm11', 's3', 'Vitamin D3 60000 IU', 'Cholecalciferol', '60000 IU', 'Capsule', 3000, 20.00);

-- ----------------------------------------------------------------------------
-- 7. Orders
-- ----------------------------------------------------------------------------
INSERT INTO orders (id, medicine, generic_name, strength, source, source_type, quantity, order_date, status, note, total_amount) VALUES
('REQ-2026-00121', 'Amoxicillin 500mg', 'Amoxicillin', '500mg', 'City Center Pharmacy', 'pharmacy', 40, '2026-09-20 10:30:00', 'accepted', 'Urgent requirement for ICU patients', 460.00),
('ORD-2026-00045', 'Paracetamol 500mg', 'Paracetamol', '500mg', 'MedSupply Distributors', 'supplier', 500, '2026-09-18 14:15:00', 'dispatched', NULL, 500.00),
('REQ-2026-00119', 'Cetirizine 10mg', 'Cetirizine', '10mg', 'Wellness MedStore', 'pharmacy', 100, '2026-09-15 09:00:00', 'completed', NULL, 350.00),
('ORD-2026-00041', 'Vitamin D3 60000 IU', 'Cholecalciferol', '60000 IU', 'HealthCore Pharma', 'supplier', 200, '2026-09-10 11:00:00', 'completed', NULL, 4000.00),
('REQ-2026-00117', 'Doxycycline 100mg', 'Doxycycline', '100mg', 'City Center Pharmacy', 'pharmacy', 30, '2026-09-08 16:45:00', 'completed', NULL, 810.00),
('ORD-2026-00038', 'Pantoprazole 40mg', 'Pantoprazole', '40mg', 'PharmaBridge Ltd', 'supplier', 150, '2026-09-05 13:20:00', 'rejected', 'Stock out at central depot', 1125.00);

-- ----------------------------------------------------------------------------
-- 8. Alerts
-- ----------------------------------------------------------------------------
INSERT INTO alerts (id, type, medicine_id, medicine_name, generic_name, strength, current_stock, minimum_stock, expiry_date) VALUES
('alert-m2', 'out_of_stock', 'm2', 'Azithromycin 500mg', 'Azithromycin', '500mg', 0, 30, '2026-08-31'),
('alert-m8', 'out_of_stock', 'm8', 'Atorvastatin 10mg', 'Atorvastatin', '10mg', 0, 30, '2026-09-30'),
('alert-m3', 'low_stock', 'm3', 'Amoxicillin 500mg', 'Amoxicillin', '500mg', 15, 40, '2026-11-30'),
('alert-m6', 'low_stock', 'm6', 'Metformin 500mg', 'Metformin', '500mg', 25, 60, '2027-01-20'),
('alert-m10', 'low_stock', 'm10', 'Doxycycline 100mg', 'Doxycycline', '100mg', 8, 20, '2027-04-15'),
('alert-m4', 'expiring_soon', 'm4', 'Cetirizine 10mg', 'Cetirizine', '10mg', 220, 30, '2026-12-26'),
('alert-m11', 'expiring_soon', 'm11', 'Salbutamol Inhaler', 'Salbutamol', '100mcg', 35, 10, '2026-12-15');
