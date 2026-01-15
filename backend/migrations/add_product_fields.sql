ALTER TABLE products 
  ADD COLUMN tags TEXT,
  ADD COLUMN discount_type ENUM('no_discount', 'percentage', 'fixed') DEFAULT 'no_discount',
  ADD COLUMN discount_value DECIMAL(10, 2) DEFAULT 0,
  ADD COLUMN shipping_width DECIMAL(10, 2),
  ADD COLUMN shipping_height DECIMAL(10, 2),
  ADD COLUMN shipping_weight DECIMAL(10, 2),
  ADD COLUMN shipping_cost DECIMAL(10, 2),
  ADD COLUMN colors TEXT,
  ADD COLUMN sizes TEXT;
