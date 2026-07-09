-- ==========================================================
-- 🏢 TIER 3: H-EARS MASTER DATABASE SCHEMA
-- ==========================================================

-- 1. DROP OLD TABLES IF THEY EXIST TO ENSURE CLEAN WORKFLOWS
DROP TABLE IF EXISTS access_requests CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 2. CREATE THE USER REGISTRY & ROLE-BASED ACCESS CONTROL (RBAC) TABLE
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    emp_id VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, 
    roles TEXT[] NOT NULL,           -- Stores multiple roles per user as an array
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. CREATE THE CORE ACCESS REQUESTS ARCHIVE TABLE
CREATE TABLE access_requests (
    id SERIAL PRIMARY KEY,
    hotel_code VARCHAR(50) NOT NULL, -- Expanded to 50 to support Clustered property tags safely
    employee_id VARCHAR(50) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    corporate_level VARCHAR(100) NOT NULL,
    manager_name VARCHAR(100) NOT NULL,
    systems_access TEXT[] NOT NULL,  -- System checkboxes saved as a flexible array
    remarks TEXT,
    file_attached VARCHAR(255),
    status VARCHAR(100) DEFAULT 'Pending Dept Head Approval',
    tier INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- 🌱 SEED CORE PERSONA ACCOUNTS FOR LIVE TESTING
-- ==========================================================
INSERT INTO users (first_name, last_name, department, position, emp_id, email, password, roles) VALUES
('Sathya', 'Admin', 'Information Technology', 'IT Director', 'EMP-777', 'admin@hotel.com', 'admin123', ARRAY['admin']),
('John', 'Requestor', 'Front office', 'GSA', 'EMP-001', 'requestor@hotel.com', 'password123', ARRAY['Requestor']),
('Sarah', 'FinanceHead', 'Finance', 'Director of Finance', 'EMP-002', 'depthead@hotel.com', 'password123', ARRAY['division/department head']),
('Michael', 'Chef', 'Food & Beverage', 'Executive Chef', 'EMP-003', 'chef@hotel.com', 'password123', ARRAY['Department Head & Requestor']),
('David', 'FC', 'Finance', 'Financial Controller', 'EMP-004', 'fc@hotel.com', 'password123', ARRAY['Financial Controller']),
('Richard', 'GM', 'Executive Office', 'General Manager', 'EMP-005', 'gm@hotel.com', 'password123', ARRAY['General Manager']);