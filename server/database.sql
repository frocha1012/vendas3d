-- Complete Database Schema for 3D Printing Sales Tracker
-- Run this in your Hostinger PHPMyAdmin to create everything from scratch
-- 
-- IMPORTANT: Replace 'u177116765_vendas3d' with your actual database name from Hostinger
-- You can find your database name in Hostinger's hPanel under "MySQL Databases"

-- Uncomment and update the database name below, or run: USE your_database_name;
-- USE u177116765_vendas3d;

-- ============ BUSINESS SETTINGS TABLE ============
CREATE TABLE IF NOT EXISTS business_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value VARCHAR(255) NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default business settings
INSERT INTO business_settings (setting_key, setting_value) VALUES
  ('default_hourly_rate', '1.00'),
  ('electricity_cost_per_kwh', '0.25'),
  ('average_printer_power_w', '250'),
  ('default_profit_margin', '50.00'),
  ('currency', 'EUR')
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);

-- ============ FILAMENTS/MATERIALS TABLE ============
CREATE TABLE IF NOT EXISTS filaments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  color_name VARCHAR(100) NOT NULL,
  brand VARCHAR(100) NOT NULL DEFAULT 'Bambu Lab',
  material VARCHAR(50) NOT NULL DEFAULT 'PLA',
  diameter_mm DECIMAL(5, 2) NOT NULL DEFAULT 1.75,
  price_per_kg DECIMAL(10, 2) NOT NULL,
  cost_per_gram DECIMAL(10, 6) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_color (color_name),
  INDEX idx_brand (brand)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert sample filaments based on your Excel
INSERT INTO filaments (color_name, brand, material, diameter_mm, price_per_kg, cost_per_gram) VALUES
  ('Black', 'Bambu Lab', 'PLA', 1.75, 12.00, 0.0120),
  ('White', 'Bambu Lab', 'PLA', 1.75, 12.00, 0.0120),
  ('Grey', 'Bambu Lab', 'PLA', 1.75, 12.00, 0.0120),
  ('Gold', 'Bambu Lab', 'PLA', 1.75, 14.00, 0.0140),
  ('Silver', 'Bambu Lab', 'PLA', 1.75, 14.00, 0.0140),
  ('Multicolor', 'Bambu Lab', 'PLA', 1.75, 16.00, 0.0160),
  ('Marble', 'Bambu Lab', 'PLA', 1.75, 20.00, 0.0200),
  ('Wood', 'Bambu Lab', 'PLA', 1.75, 20.00, 0.0200)
ON DUPLICATE KEY UPDATE cost_per_gram = VALUES(cost_per_gram);

-- ============ ITEMS TABLE (COMPLETE) ============
CREATE TABLE IF NOT EXISTS items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  color VARCHAR(100),
  filament_id INT,
  grams_used DECIMAL(10, 2),
  material_cost DECIMAL(10, 2) DEFAULT 0,
  print_time_hours DECIMAL(10, 2),
  hourly_rate DECIMAL(10, 2),
  labor_cost DECIMAL(10, 2) DEFAULT 0,
  electricity_kw DECIMAL(10, 4),
  electricity_cost DECIMAL(10, 2) DEFAULT 0,
  total_cost_no_labor DECIMAL(10, 2) DEFAULT 0,
  profit_margin DECIMAL(5, 2),
  final_price DECIMAL(10, 2),
  -- Legacy field for backward compatibility
  build_price DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (filament_id) REFERENCES filaments(id) ON DELETE SET NULL,
  INDEX idx_name (name),
  INDEX idx_color (color),
  INDEX idx_filament (filament_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============ ORDERS TABLE ============
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  item_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  sale_price DECIMAL(10, 2) NOT NULL,
  sale_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
  INDEX idx_item_id (item_id),
  INDEX idx_sale_date (sale_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;