-- ======================================================
-- STEELTRACK ERP - PROFESSIONAL DATABASE SCHEMA
-- PostgreSQL 15+
-- ======================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ======================================================
-- 1. INVENTORY MODULE
-- ======================================================

-- Categories (dynamic)
CREATE TABLE categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    type VARCHAR(50) DEFAULT 'material', -- material, equipment, tool
    parent_id UUID REFERENCES categories(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Units
CREATE TABLE units (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    symbol VARCHAR(10),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Materials (inventory)
CREATE TABLE materials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    category_id UUID REFERENCES categories(id),
    unit_id UUID REFERENCES units(id),
    quantity DECIMAL(15,3) DEFAULT 0,
    cost DECIMAL(15,2) DEFAULT 0,
    min_stock DECIMAL(15,3) DEFAULT 0,
    max_stock DECIMAL(15,3),
    location VARCHAR(50),
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Stock Transactions (mandatory for all stock changes)
CREATE TABLE stock_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(30) NOT NULL, -- IMPORT, EXPORT, TRANSFER, RESERVE, PRODUCTION, RETURN, ADJUSTMENT
    material_id UUID REFERENCES materials(id),
    quantity DECIMAL(15,3) NOT NULL,
    unit_price DECIMAL(15,2),
    total_amount DECIMAL(15,2),
    before_quantity DECIMAL(15,3),
    after_quantity DECIMAL(15,3),
    reference_type VARCHAR(50), -- purchase_order, production_order, project
    reference_id UUID,
    note TEXT,
    transaction_date TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ======================================================
-- 2. SUPPLIER MODULE
-- ======================================================

CREATE TABLE suppliers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    tax_code VARCHAR(50),
    contact_person VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    rating DECIMAL(3,2) DEFAULT 0,
    total_purchases DECIMAL(15,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ======================================================
-- 3. PROJECT MODULE
-- ======================================================

CREATE TABLE projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    customer_name VARCHAR(200),
    contract_value DECIMAL(15,2),
    budget DECIMAL(15,2),
    spent DECIMAL(15,2) DEFAULT 0,
    status VARCHAR(30) DEFAULT 'planning',
    start_date DATE,
    expected_end_date DATE,
    actual_end_date DATE,
    progress_percent INT DEFAULT 0,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- ======================================================
-- 4. COMPONENT/STRUCTURE MODULE
-- ======================================================

CREATE TABLE structures (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    type VARCHAR(50),
    unit_id UUID REFERENCES units(id),
    quantity INT DEFAULT 0,
    cost DECIMAL(15,2) DEFAULT 0,
    weight DECIMAL(10,2),
    length DECIMAL(10,2),
    width DECIMAL(10,2),
    height DECIMAL(10,2),
    drawing_number VARCHAR(100),
    revision VARCHAR(10),
    status VARCHAR(30) DEFAULT 'in_stock', -- in_stock, producing, exported
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Structure BOM (Bill of Materials)
CREATE TABLE structure_bom (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    structure_id UUID REFERENCES structures(id) ON DELETE CASCADE,
    material_id UUID REFERENCES materials(id),
    quantity_required DECIMAL(15,3) NOT NULL,
    waste_percent DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(structure_id, material_id)
);

-- Production Orders
CREATE TABLE production_orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    structure_id UUID REFERENCES structures(id),
    quantity INT NOT NULL,
    produced_quantity INT DEFAULT 0,
    rejected_quantity INT DEFAULT 0,
    status VARCHAR(30) DEFAULT 'pending', -- pending, cutting, welding, qc, painting, completed
    current_step VARCHAR(30) DEFAULT 'design',
    start_date DATE,
    end_date DATE,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- QC Inspections
CREATE TABLE qc_inspections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    production_order_id UUID REFERENCES production_orders(id),
    inspector_name VARCHAR(100),
    inspection_date TIMESTAMPTZ DEFAULT NOW(),
    dimensions_ok BOOLEAN DEFAULT false,
    weld_quality_ok BOOLEAN DEFAULT false,
    surface_ok BOOLEAN DEFAULT false,
    weight_ok BOOLEAN DEFAULT false,
    result VARCHAR(30) NOT NULL, -- pass, fail, partial
    defects TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ======================================================
-- 5. YARD MANAGEMENT MODULE
-- ======================================================

-- Yard Zones (A-K)
CREATE TABLE yard_zones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(50) NOT NULL,
    min_row INT DEFAULT 1,
    max_row INT DEFAULT 50,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Yard Positions
CREATE TABLE yard_positions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    zone_id UUID REFERENCES yard_zones(id),
    row_number INT NOT NULL,
    col_number INT NOT NULL,
    layer_number INT DEFAULT 1,
    is_occupied BOOLEAN DEFAULT false,
    current_structure_id UUID REFERENCES structures(id),
    current_weight DECIMAL(12,2) DEFAULT 0,
    max_weight DECIMAL(12,2) DEFAULT 10000,
    max_stack_height INT DEFAULT 4,
    status VARCHAR(30) DEFAULT 'empty',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(zone_id, row_number, col_number, layer_number)
);

-- Component Movements
CREATE TABLE component_movements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    structure_id UUID REFERENCES structures(id),
    from_position_id UUID REFERENCES yard_positions(id),
    to_position_id UUID REFERENCES yard_positions(id),
    movement_type VARCHAR(30) NOT NULL, -- placement, relocation, removal
    moved_by UUID,
    moved_at TIMESTAMPTZ DEFAULT NOW(),
    note TEXT
);

-- ======================================================
-- 6. INDEXES FOR PERFORMANCE
-- ======================================================

-- Inventory indexes
CREATE INDEX idx_materials_code ON materials(code);
CREATE INDEX idx_materials_category ON materials(category_id);
CREATE INDEX idx_materials_quantity ON materials(quantity);
CREATE INDEX idx_stock_transactions_type ON stock_transactions(type);
CREATE INDEX idx_stock_transactions_date ON stock_transactions(transaction_date);
CREATE INDEX idx_stock_transactions_material ON stock_transactions(material_id);

-- Component indexes
CREATE INDEX idx_structures_code ON structures(code);
CREATE INDEX idx_structures_type ON structures(type);
CREATE INDEX idx_structure_bom_structure ON structure_bom(structure_id);
CREATE INDEX idx_production_orders_status ON production_orders(status);

-- Yard indexes
CREATE INDEX idx_yard_positions_zone ON yard_positions(zone_id);
CREATE INDEX idx_yard_positions_occupied ON yard_positions(is_occupied) WHERE is_occupied = true;

-- ======================================================
-- 7. SEED DATA (Dữ liệu mẫu)
-- ======================================================

-- Insert categories
INSERT INTO categories (id, name, type) VALUES
    (gen_random_uuid(), 'Thép hình', 'material'),
    (gen_random_uuid(), 'Thép hộp', 'material'),
    (gen_random_uuid(), 'Thép tấm', 'material'),
    (gen_random_uuid(), 'Ống thép', 'material'),
    (gen_random_uuid(), 'Bu lông - Ốc vít', 'consumable'),
    (gen_random_uuid(), 'Sơn - Chống gỉ', 'consumable'),
    (gen_random_uuid(), 'Vật tư hàn cắt', 'consumable'),
    (gen_random_uuid(), 'Thiết bị', 'equipment'),
    (gen_random_uuid(), 'Dụng cụ', 'tool');

-- Insert units
INSERT INTO units (id, name, symbol) VALUES
    (gen_random_uuid(), 'Mét', 'm'),
    (gen_random_uuid(), 'Mét vuông', 'm²'),
    (gen_random_uuid(), 'Kilogram', 'kg'),
    (gen_random_uuid(), 'Tấn', 't'),
    (gen_random_uuid(), 'Cái', 'pc'),
    (gen_random_uuid(), 'Thùng', 'can');

-- Insert materials
DO $$
DECLARE
    v_cat_thephinh UUID;
    v_cat_thephop UUID;
    v_cat_theptam UUID;
    v_cat_ongthep UUID;
    v_cat_bulong UUID;
    v_cat_son UUID;
    v_cat_han UUID;
    v_unit_tan UUID;
    v_unit_m UUID;
    v_unit_m2 UUID;
    v_unit_kg UUID;
    v_unit_pc UUID;
    v_unit_can UUID;
BEGIN
    SELECT id INTO v_cat_thephinh FROM categories WHERE name = 'Thép hình' LIMIT 1;
    SELECT id INTO v_cat_thephop FROM categories WHERE name = 'Thép hộp' LIMIT 1;
    SELECT id INTO v_cat_theptam FROM categories WHERE name = 'Thép tấm' LIMIT 1;
    SELECT id INTO v_cat_ongthep FROM categories WHERE name = 'Ống thép' LIMIT 1;
    SELECT id INTO v_cat_bulong FROM categories WHERE name = 'Bu lông - Ốc vít' LIMIT 1;
    SELECT id INTO v_cat_son FROM categories WHERE name = 'Sơn - Chống gỉ' LIMIT 1;
    SELECT id INTO v_cat_han FROM categories WHERE name = 'Vật tư hàn cắt' LIMIT 1;
    SELECT id INTO v_unit_tan FROM units WHERE symbol = 't' LIMIT 1;
    SELECT id INTO v_unit_m FROM units WHERE symbol = 'm' LIMIT 1;
    SELECT id INTO v_unit_m2 FROM units WHERE symbol = 'm²' LIMIT 1;
    SELECT id INTO v_unit_kg FROM units WHERE symbol = 'kg' LIMIT 1;
    SELECT id INTO v_unit_pc FROM units WHERE symbol = 'pc' LIMIT 1;
    SELECT id INTO v_unit_can FROM units WHERE symbol = 'can' LIMIT 1;

    INSERT INTO materials (code, name, category_id, unit_id, quantity, cost, min_stock) VALUES
        ('HBEAM-100', 'H Beam 100x100', v_cat_thephinh, v_unit_tan, 150, 1250000, 20),
        ('IBEAM-150', 'I Beam 150x150', v_cat_thephinh, v_unit_tan, 80, 1850000, 15),
        ('ANGLE-50', 'Angle Bar 50x50', v_cat_thephinh, v_unit_m, 500, 450000, 50),
        ('SQUARE-100', 'Thép hộp 100x100x4', v_cat_thephop, v_unit_m, 350, 890000, 40),
        ('PLATE-10', 'Thép tấm SS400 dày 10mm', v_cat_theptam, v_unit_m2, 200, 890000, 30),
        ('PIPE-114', 'Ống thép D114x4.0', v_cat_ongthep, v_unit_m, 180, 320000, 25),
        ('BOLT-M20', 'Bu lông cường độ cao M20x70', v_cat_bulong, v_unit_pc, 5000, 25000, 500),
        ('EPOXY-PRIMER', 'Sơn Epoxy Primer', v_cat_son, v_unit_can, 50, 350000, 10),
        ('WELD-E7018', 'Que hàn E7018 φ4.0', v_cat_han, v_unit_kg, 2000, 45000, 200);
END $$;

-- Insert projects
INSERT INTO projects (code, name, customer_name, contract_value, budget, status, start_date) VALUES
    ('PRJ-001', 'Nhà máy A', 'Công ty A', 2500000000, 2500000000, 'active', '2024-01-15'),
    ('PRJ-002', 'Cầu đường B', 'Công ty B', 5800000000, 5800000000, 'active', '2024-02-01'),
    ('PRJ-003', 'Chung cư C', 'Công ty C', 4200000000, 4200000000, 'planning', '2024-03-10');

-- Insert structures
INSERT INTO structures (code, name, type, unit_id, quantity, cost, weight, length, width, height, status) VALUES
    ('SF-001', 'Cột biên CB-01', 'Column', v_unit_pc, 10, 8500000, 1200, 6, 0.3, 0.3, 'in_stock'),
    ('SF-002', 'Cột giữa CG-02', 'Column', v_unit_pc, 12, 9750000, 1350, 6, 0.35, 0.35, 'in_stock'),
    ('SF-003', 'Kèo chính KC-01', 'Beam', v_unit_pc, 14, 11000000, 1500, 12, 0.25, 0.4, 'in_stock'),
    ('SF-004', 'Xà gồ XG-01', 'Purlin', v_unit_pc, 25, 850000, 450, 8, 0.15, 0.2, 'in_stock');

-- Insert structure BOM
INSERT INTO structure_bom (structure_id, material_id, quantity_required) VALUES
    ((SELECT id FROM structures WHERE code = 'SF-001'), (SELECT id FROM materials WHERE code = 'HBEAM-100'), 0.15),
    ((SELECT id FROM structures WHERE code = 'SF-001'), (SELECT id FROM materials WHERE code = 'IBEAM-150'), 0.23),
    ((SELECT id FROM structures WHERE code = 'SF-002'), (SELECT id FROM materials WHERE code = 'HBEAM-100'), 0.18),
    ((SELECT id FROM structures WHERE code = 'SF-003'), (SELECT id FROM materials WHERE code = 'IBEAM-150'), 0.31);

-- Insert yard zones (A-K)
INSERT INTO yard_zones (code, name, min_row, max_row) VALUES
    ('A', 'Khu A - Cột', 1, 50),
    ('B', 'Khu B - Dầm', 1, 50),
    ('C', 'Khu C - Kèo', 1, 50),
    ('D', 'Khu D - Xà gồ', 1, 50);

-- Insert sample yard positions (simplified)
INSERT INTO yard_positions (zone_id, row_number, col_number, is_occupied, current_structure_id, status)
SELECT 
    z.id,
    row_num,
    col_num,
    false,
    NULL,
    'empty'
FROM yard_zones z
CROSS JOIN generate_series(1, 10) AS row_num
CROSS JOIN generate_series(1, 10) AS col_num
LIMIT 400;

SELECT '✅ Database schema created successfully!' as status;
SELECT 
    (SELECT COUNT(*) FROM categories) as categories,
    (SELECT COUNT(*) FROM units) as units,
    (SELECT COUNT(*) FROM materials) as materials,
    (SELECT COUNT(*) FROM projects) as projects,
    (SELECT COUNT(*) FROM structures) as structures,
    (SELECT COUNT(*) FROM yard_positions) as yard_positions;
