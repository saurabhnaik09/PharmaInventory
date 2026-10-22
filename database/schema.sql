-- ============================================================================
-- Pharma Inventory Database Schema
-- Compatible with PostgreSQL, MySQL 8.0+, and SQLite
-- ============================================================================

-- Drop existing tables in reverse dependency order
DROP TABLE IF EXISTS alerts;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS supplier_medicines;
DROP TABLE IF EXISTS pharmacy_medicines;
DROP TABLE IF EXISTS suppliers;
DROP TABLE IF EXISTS pharmacies;
DROP TABLE IF EXISTS medicines;
DROP TABLE IF EXISTS users;

-- ----------------------------------------------------------------------------
-- 1. Users Table
-- ----------------------------------------------------------------------------
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    role VARCHAR(20) NOT NULL CHECK (role IN ('pharmacy', 'supplier', 'admin')),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    license_number VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 2. Medicines Table (Inventory)
-- ----------------------------------------------------------------------------
CREATE TABLE medicines (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    generic_name VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,
    strength VARCHAR(50) NOT NULL,
    dosage_form VARCHAR(50) NOT NULL,
    batch_number VARCHAR(100) NOT NULL,
    current_stock INT NOT NULL DEFAULT 0,
    minimum_stock INT NOT NULL DEFAULT 10,
    unit_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    expiry_date DATE NOT NULL,
    supplier VARCHAR(200) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'in_stock' 
        CHECK (status IN ('in_stock', 'low_stock', 'out_of_stock', 'expiring_soon')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_medicines_category ON medicines(category);
CREATE INDEX idx_medicines_status ON medicines(status);
CREATE INDEX idx_medicines_expiry ON medicines(expiry_date);
CREATE INDEX idx_medicines_name ON medicines(name);

-- ----------------------------------------------------------------------------
-- 3. Partner Pharmacies Table
-- ----------------------------------------------------------------------------
CREATE TABLE pharmacies (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    distance DECIMAL(5, 2) NOT NULL DEFAULT 0.00, -- in kilometers
    rating DECIMAL(2, 1) NOT NULL DEFAULT 5.0,
    contact_phone VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pharmacies_city ON pharmacies(city);

-- ----------------------------------------------------------------------------
-- 4. Pharmacy Available Medicines (Inter-pharmacy stock sharing)
-- ----------------------------------------------------------------------------
CREATE TABLE pharmacy_medicines (
    id VARCHAR(50) PRIMARY KEY,
    pharmacy_id VARCHAR(50) NOT NULL,
    medicine_name VARCHAR(200) NOT NULL,
    generic_name VARCHAR(200) NOT NULL,
    strength VARCHAR(50) NOT NULL,
    dosage_form VARCHAR(50) NOT NULL,
    available_qty INT NOT NULL DEFAULT 0,
    unit_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pharmacy_id) REFERENCES pharmacies(id) ON DELETE CASCADE
);

CREATE INDEX idx_pharmacy_med_name ON pharmacy_medicines(medicine_name);
CREATE INDEX idx_pharmacy_med_pharmacy ON pharmacy_medicines(pharmacy_id);

-- ----------------------------------------------------------------------------
-- 5. Suppliers Table
-- ----------------------------------------------------------------------------
CREATE TABLE suppliers (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    estimated_delivery VARCHAR(50) NOT NULL, -- e.g. "1-2 days"
    minimum_order_quantity INT NOT NULL DEFAULT 1,
    rating DECIMAL(2, 1) NOT NULL DEFAULT 5.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_suppliers_city ON suppliers(city);

-- ----------------------------------------------------------------------------
-- 6. Supplier Catalog Medicines
-- ----------------------------------------------------------------------------
CREATE TABLE supplier_medicines (
    id VARCHAR(50) PRIMARY KEY,
    supplier_id VARCHAR(50) NOT NULL,
    medicine_name VARCHAR(200) NOT NULL,
    generic_name VARCHAR(200) NOT NULL,
    strength VARCHAR(50) NOT NULL,
    dosage_form VARCHAR(50) NOT NULL,
    available_qty INT NOT NULL DEFAULT 0,
    unit_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE
);

CREATE INDEX idx_supplier_med_name ON supplier_medicines(medicine_name);
CREATE INDEX idx_supplier_med_supplier ON supplier_medicines(supplier_id);

-- ----------------------------------------------------------------------------
-- 7. Procurement Orders Table
-- ----------------------------------------------------------------------------
CREATE TABLE orders (
    id VARCHAR(50) PRIMARY KEY,
    medicine VARCHAR(200) NOT NULL,
    generic_name VARCHAR(200) NOT NULL,
    strength VARCHAR(50) NOT NULL,
    source VARCHAR(200) NOT NULL,
    source_type VARCHAR(20) NOT NULL CHECK (source_type IN ('pharmacy', 'supplier')),
    quantity INT NOT NULL DEFAULT 1,
    order_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(30) NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'accepted', 'processing', 'dispatched', 'completed', 'rejected')),
    note TEXT,
    total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_date ON orders(order_date);

-- ----------------------------------------------------------------------------
-- 8. Inventory Alerts Table
-- ----------------------------------------------------------------------------
CREATE TABLE alerts (
    id VARCHAR(50) PRIMARY KEY,
    type VARCHAR(30) NOT NULL CHECK (type IN ('low_stock', 'out_of_stock', 'expiring_soon')),
    medicine_id VARCHAR(50) NOT NULL,
    medicine_name VARCHAR(200) NOT NULL,
    generic_name VARCHAR(200) NOT NULL,
    strength VARCHAR(50) NOT NULL,
    current_stock INT NOT NULL DEFAULT 0,
    minimum_stock INT,
    expiry_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE
);

CREATE INDEX idx_alerts_type ON alerts(type);
CREATE INDEX idx_alerts_created ON alerts(created_at);
