# 🗄️ Pharma Inventory — Database Layer

This directory contains the database design, schemas, seed records, and documentation for the **Pharma Inventory System**.

---

## 📂 Directory Contents

| File | Purpose |
|------|---------|
| [`schema.sql`](./schema.sql) | Table definitions, primary/foreign key constraints, indices, and checks. |
| [`seeds.sql`](./seeds.sql) | Initial mock data for medicines, pharmacies, suppliers, orders, and alerts. |

---

## 🏗️ Entity Relationship Diagram

```mermaid
erDiagram
    USERS {
        VARCHAR id PK
        VARCHAR role
        VARCHAR name
        VARCHAR email UK
        VARCHAR license_number
        VARCHAR city
        TIMESTAMP created_at
    }

    MEDICINES {
        VARCHAR id PK
        VARCHAR name
        VARCHAR generic_name
        VARCHAR category
        VARCHAR strength
        VARCHAR dosage_form
        VARCHAR batch_number
        INT current_stock
        INT minimum_stock
        DECIMAL unit_price
        DATE expiry_date
        VARCHAR supplier
        VARCHAR status
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    ALERTS {
        VARCHAR id PK
        VARCHAR type
        VARCHAR medicine_id FK
        VARCHAR medicine_name
        VARCHAR generic_name
        VARCHAR strength
        INT current_stock
        INT minimum_stock
        DATE expiry_date
        TIMESTAMP created_at
    }

    PHARMACIES {
        VARCHAR id PK
        VARCHAR name
        VARCHAR city
        TEXT address
        DECIMAL distance
        DECIMAL rating
        VARCHAR contact_phone
        TIMESTAMP created_at
    }

    PHARMACY_MEDICINES {
        VARCHAR id PK
        VARCHAR pharmacy_id FK
        VARCHAR medicine_name
        VARCHAR generic_name
        VARCHAR strength
        VARCHAR dosage_form
        INT available_qty
        DECIMAL unit_price
    }

    SUPPLIERS {
        VARCHAR id PK
        VARCHAR name
        VARCHAR city
        TEXT address
        VARCHAR estimated_delivery
        INT minimum_order_quantity
        DECIMAL rating
        TIMESTAMP created_at
    }

    SUPPLIER_MEDICINES {
        VARCHAR id PK
        VARCHAR supplier_id FK
        VARCHAR medicine_name
        VARCHAR generic_name
        VARCHAR strength
        VARCHAR dosage_form
        INT available_qty
        DECIMAL unit_price
    }

    ORDERS {
        VARCHAR id PK
        VARCHAR medicine
        VARCHAR generic_name
        VARCHAR strength
        VARCHAR source
        VARCHAR source_type
        INT quantity
        TIMESTAMP order_date
        VARCHAR status
        TEXT note
        DECIMAL total_amount
    }

    MEDICINES ||--o{ ALERTS : triggers
    PHARMACIES ||--o{ PHARMACY_MEDICINES : stocks
    SUPPLIERS ||--o{ SUPPLIER_MEDICINES : supplies
```

---

## 🚀 How to Run / Import the Database

### Option 1: SQLite (Instant, Zero Configuration)
```bash
sqlite3 pharma.db < schema.sql
sqlite3 pharma.db < seeds.sql
```

### Option 2: PostgreSQL
```bash
psql -U postgres -d pharma_inventory -f schema.sql
psql -U postgres -d pharma_inventory -f seeds.sql
```

### Option 3: MySQL / MariaDB
```bash
mysql -u root -p pharma_inventory < schema.sql
mysql -u root -p pharma_inventory < seeds.sql
```
