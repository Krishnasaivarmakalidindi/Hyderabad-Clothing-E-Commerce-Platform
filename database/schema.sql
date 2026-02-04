-- Hyderabad Clothing E-Commerce Platform - Database Schema
-- PostgreSQL 14+

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone_number VARCHAR(20) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  preferred_language VARCHAR(2) DEFAULT 'en' CHECK (preferred_language IN ('en', 'te')),
  user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('customer', 'seller', 'admin')),
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  email_verified_at TIMESTAMP,
  phone_verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_users_type ON users(user_type);

-- ============================================
-- SELLER PROFILES TABLE
-- ============================================
CREATE TABLE seller_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  business_name VARCHAR(255) NOT NULL,
  gst_number VARCHAR(15) UNIQUE,
  pan_number VARCHAR(10) UNIQUE,
  bank_account_number VARCHAR(50),
  bank_ifsc_code VARCHAR(11),
  bank_account_holder_name VARCHAR(255),
  business_address TEXT,
  city VARCHAR(100) DEFAULT 'Hyderabad',
  state VARCHAR(100) DEFAULT 'Telangana',
  pincode VARCHAR(6),
  commission_rate DECIMAL(3, 2) DEFAULT 0.07 CHECK (commission_rate >= 0 AND commission_rate <= 1),
  kyc_status VARCHAR(20) DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'approved', 'rejected')),
  kyc_verified_at TIMESTAMP,
  onboarding_status VARCHAR(20) DEFAULT 'application' CHECK (onboarding_status IN ('application', 'verification', 'approved', 'rejected')),
  total_orders INT DEFAULT 0,
  total_revenue DECIMAL(12, 2) DEFAULT 0,
  average_rating DECIMAL(3, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_seller_profiles_user ON seller_profiles(user_id);
CREATE INDEX idx_seller_profiles_kyc_status ON seller_profiles(kyc_status);

-- ============================================
-- CUSTOMER PROFILES TABLE
-- ============================================
CREATE TABLE customer_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  total_orders INT DEFAULT 0,
  total_spent DECIMAL(12, 2) DEFAULT 0,
  return_count INT DEFAULT 0,
  return_rate DECIMAL(5, 2) DEFAULT 0,
  fraud_score DECIMAL(3, 2) DEFAULT 0 CHECK (fraud_score >= 0 AND fraud_score <= 1),
  is_flagged BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_customer_profiles_user ON customer_profiles(user_id);
CREATE INDEX idx_customer_profiles_fraud ON customer_profiles(fraud_score);

-- ============================================
-- ADDRESSES TABLE
-- ============================================
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  address_type VARCHAR(20) DEFAULT 'shipping' CHECK (address_type IN ('shipping', 'billing')),
  full_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  landmark VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  pincode VARCHAR(6) NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_addresses_user ON addresses(user_id);

-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name_en VARCHAR(255) NOT NULL,
  name_te VARCHAR(255),
  description_en TEXT,
  description_te TEXT,
  category VARCHAR(50) NOT NULL CHECK (category IN ('kurta', 'saree', 'salwar', 'shirt', 'pants', 'dress', 'accessories')),
  subcategory VARCHAR(50),
  fabric_type VARCHAR(50),
  price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
  mrp DECIMAL(10, 2),
  commission_rate DECIMAL(3, 2) DEFAULT 0.07,
  tax_rate DECIMAL(4, 2) DEFAULT 0.05,
  base_shipping_cost DECIMAL(8, 2) DEFAULT 50,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'inactive', 'out_of_stock')),
  total_stock INT DEFAULT 0,
  total_sold INT DEFAULT 0,
  average_rating DECIMAL(3, 2) DEFAULT 0,
  total_reviews INT DEFAULT 0,
  return_rate DECIMAL(5, 2) DEFAULT 0,
  images JSONB DEFAULT '[]',
  video_url VARCHAR(500),
  size_chart_url VARCHAR(500),
  is_made_to_order BOOLEAN DEFAULT false,
  production_time_days INT DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP
);

CREATE INDEX idx_products_seller ON products(seller_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_featured ON products(featured);

-- ============================================
-- PRODUCT VARIANTS TABLE (Sizes)
-- ============================================
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size VARCHAR(10) NOT NULL CHECK (size IN ('XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Free Size')),
  sku VARCHAR(50) UNIQUE,
  stock_available INT NOT NULL DEFAULT 0 CHECK (stock_available >= 0),
  stock_reserved INT DEFAULT 0 CHECK (stock_reserved >= 0),
  stock_in_transit INT DEFAULT 0 CHECK (stock_in_transit >= 0),
  stock_on_hold INT DEFAULT 0 CHECK (stock_on_hold >= 0),
  price_adjustment DECIMAL(8, 2) DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(product_id, size)
);

CREATE INDEX idx_product_variants_product ON product_variants(product_id);
CREATE INDEX idx_product_variants_sku ON product_variants(sku);

-- ============================================
-- CUSTOMER SIZE DATA TABLE
-- ============================================
CREATE TABLE customer_size_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  height_cm INT CHECK (height_cm > 0 AND height_cm < 300),
  weight_kg DECIMAL(5, 2) CHECK (weight_kg > 0 AND weight_kg < 300),
  chest_cm INT CHECK (chest_cm > 0 AND chest_cm < 200),
  waist_cm INT CHECK (waist_cm > 0 AND waist_cm < 200),
  hip_cm INT CHECK (hip_cm > 0 AND hip_cm < 200),
  shoulder_cm INT CHECK (shoulder_cm > 0 AND shoulder_cm < 100),
  body_type VARCHAR(20) CHECK (body_type IN ('slim', 'average', 'curvy', 'athletic')),
  fit_preference VARCHAR(20) CHECK (fit_preference IN ('tight', 'regular', 'loose')),
  previous_sizes_purchased JSONB DEFAULT '{}',
  size_preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_customer_size_data_customer ON customer_size_data(customer_id);

-- ============================================
-- ORDERS TABLE
-- ============================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  seller_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE RESTRICT,
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  tax_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  shipping_cost DECIMAL(8, 2) NOT NULL DEFAULT 0,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL,
  commission_amount DECIMAL(10, 2) DEFAULT 0,
  seller_payout_amount DECIMAL(10, 2),
  status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'payment_pending', 'confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'refunded')),
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  payment_method VARCHAR(20) CHECK (payment_method IN ('upi', 'card', 'wallet', 'netbanking', 'cod')),
  payment_id VARCHAR(100),
  razorpay_order_id VARCHAR(100),
  razorpay_payment_id VARCHAR(100),
  delivery_address_id UUID REFERENCES addresses(id),
  tracking_number VARCHAR(100),
  courier_partner VARCHAR(100),
  estimated_delivery_date DATE,
  actual_delivery_date TIMESTAMP,
  is_return_eligible BOOLEAN DEFAULT true,
  return_window_end_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  confirmed_at TIMESTAMP,
  shipped_at TIMESTAMP,
  delivered_at TIMESTAMP,
  cancelled_at TIMESTAMP
);

CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_seller ON orders(seller_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- ============================================
-- ORDER STATUS HISTORY TABLE
-- ============================================
CREATE TABLE order_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status VARCHAR(30) NOT NULL,
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_order_status_history_order ON order_status_history(order_id);

-- ============================================
-- RETURNS TABLE
-- ============================================
CREATE TABLE returns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  return_number VARCHAR(50) UNIQUE NOT NULL,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
  customer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  seller_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  reason VARCHAR(50) NOT NULL CHECK (reason IN ('size_too_small', 'size_too_large', 'quality_issue', 'damaged', 'wrong_item', 'not_as_described', 'changed_mind', 'not_received')),
  return_type VARCHAR(20) NOT NULL CHECK (return_type IN ('exchange', 'refund')),
  exchange_variant_id UUID REFERENCES product_variants(id),
  status VARCHAR(30) DEFAULT 'requested' CHECK (status IN ('requested', 'approved', 'rejected', 'pickup_scheduled', 'in_transit', 'received', 'inspecting', 'approved_for_refund', 'processed', 'completed', 'cancelled')),
  customer_comments TEXT,
  admin_notes TEXT,
  refund_amount DECIMAL(10, 2),
  refund_status VARCHAR(20) CHECK (refund_status IN ('pending', 'processing', 'completed', 'failed')),
  refund_id VARCHAR(100),
  fraud_score DECIMAL(3, 2) DEFAULT 0 CHECK (fraud_score >= 0 AND fraud_score <= 1),
  is_wardrobing BOOLEAN DEFAULT false,
  wardrobing_evidence TEXT,
  return_label_url VARCHAR(500),
  return_tracking_number VARCHAR(100),
  return_images JSONB DEFAULT '[]',
  qc_inspection_result VARCHAR(20) CHECK (qc_inspection_result IN ('pass', 'fail', 'pending')),
  qc_notes TEXT,
  qc_images JSONB DEFAULT '[]',
  pickup_scheduled_at TIMESTAMP,
  received_at_warehouse_at TIMESTAMP,
  inspected_at TIMESTAMP,
  refund_processed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_returns_order ON returns(order_id);
CREATE INDEX idx_returns_customer ON returns(customer_id);
CREATE INDEX idx_returns_seller ON returns(seller_id);
CREATE INDEX idx_returns_status ON returns(status);
CREATE INDEX idx_returns_fraud_score ON returns(fraud_score);

-- ============================================
-- SELLER PAYOUTS TABLE
-- ============================================
CREATE TABLE seller_payouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payout_number VARCHAR(50) UNIQUE NOT NULL,
  seller_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  payout_period_start DATE NOT NULL,
  payout_period_end DATE NOT NULL,
  orders_count INT DEFAULT 0,
  orders_total DECIMAL(12, 2) DEFAULT 0,
  commission_deducted DECIMAL(12, 2) DEFAULT 0,
  tax_deducted DECIMAL(12, 2) DEFAULT 0,
  return_logistics_deducted DECIMAL(12, 2) DEFAULT 0,
  adjustments DECIMAL(12, 2) DEFAULT 0,
  net_payout DECIMAL(12, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  bank_reference_number VARCHAR(100),
  utr_number VARCHAR(100),
  payout_method VARCHAR(20) DEFAULT 'bank_transfer',
  scheduled_payout_date DATE,
  actual_payout_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  processed_at TIMESTAMP
);

CREATE INDEX idx_seller_payouts_seller ON seller_payouts(seller_id);
CREATE INDEX idx_seller_payouts_status ON seller_payouts(status);
CREATE INDEX idx_seller_payouts_payout_date ON seller_payouts(scheduled_payout_date);

-- ============================================
-- PAYOUT LINE ITEMS TABLE
-- ============================================
CREATE TABLE payout_line_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payout_id UUID NOT NULL REFERENCES seller_payouts(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
  order_amount DECIMAL(10, 2) NOT NULL,
  commission_amount DECIMAL(10, 2) NOT NULL,
  seller_amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payout_line_items_payout ON payout_line_items(payout_id);
CREATE INDEX idx_payout_line_items_order ON payout_line_items(order_id);

-- ============================================
-- REVIEWS TABLE
-- ============================================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  review_text TEXT,
  size_accuracy_rating INT CHECK (size_accuracy_rating >= 1 AND size_accuracy_rating <= 5),
  quality_rating INT CHECK (quality_rating >= 1 AND quality_rating <= 5),
  images JSONB DEFAULT '[]',
  is_verified_purchase BOOLEAN DEFAULT true,
  is_approved BOOLEAN DEFAULT false,
  admin_notes TEXT,
  helpful_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(order_id, customer_id)
);

CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_customer ON reviews(customer_id);
CREATE INDEX idx_reviews_seller ON reviews(seller_id);
CREATE INDEX idx_reviews_approved ON reviews(is_approved);

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('order_placed', 'order_confirmed', 'order_shipped', 'order_delivered', 'return_approved', 'payout_processed', 'product_published', 'low_stock_alert', 'review_received')),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  channel VARCHAR(20) NOT NULL CHECK (channel IN ('email', 'whatsapp', 'sms', 'in_app')),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'read')),
  metadata JSONB DEFAULT '{}',
  sent_at TIMESTAMP,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_type ON notifications(type);

-- ============================================
-- CARTS TABLE
-- ============================================
CREATE TABLE carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  size VARCHAR(50),
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(customer_id, product_id, size)
);

CREATE INDEX idx_carts_customer ON carts(customer_id);
CREATE INDEX idx_carts_added_at ON carts(added_at DESC);

-- ============================================
-- WISHLISTS TABLE
-- ============================================
CREATE TABLE wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(customer_id, product_id)
);

CREATE INDEX idx_wishlists_customer ON wishlists(customer_id);

-- ============================================
-- FRAUD DETECTION LOGS TABLE
-- ============================================
CREATE TABLE fraud_detection_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type VARCHAR(20) NOT NULL CHECK (entity_type IN ('order', 'return', 'user')),
  entity_id UUID NOT NULL,
  fraud_type VARCHAR(50) NOT NULL CHECK (fraud_type IN ('wardrobing', 'high_return_rate', 'suspicious_pattern', 'fake_review', 'payment_fraud')),
  fraud_score DECIMAL(3, 2) NOT NULL CHECK (fraud_score >= 0 AND fraud_score <= 1),
  detection_method VARCHAR(50),
  evidence JSONB DEFAULT '{}',
  action_taken VARCHAR(50),
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_fraud_logs_entity ON fraud_detection_logs(entity_type, entity_id);
CREATE INDEX idx_fraud_logs_score ON fraud_detection_logs(fraud_score DESC);

-- ============================================
-- ANALYTICS EVENTS TABLE
-- ============================================
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type VARCHAR(50) NOT NULL,
  user_id UUID REFERENCES users(id),
  session_id VARCHAR(100),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_user ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at DESC);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_seller_profiles_updated_at BEFORE UPDATE ON seller_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customer_profiles_updated_at BEFORE UPDATE ON customer_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON addresses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON product_variants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customer_size_data_updated_at BEFORE UPDATE ON customer_size_data FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_returns_updated_at BEFORE UPDATE ON returns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_seller_payouts_updated_at BEFORE UPDATE ON seller_payouts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_carts_updated_at BEFORE UPDATE ON carts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SEED DATA
-- ============================================

-- NOTE: Admin user should be created using the seed_admin.ts script
-- with secure credentials from environment variables.
-- Run: npx ts-node database/seed_admin.ts
--
-- Required environment variables:
--   ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_PHONE, ADMIN_NAME
--
-- DO NOT insert hardcoded admin credentials here!

COMMENT ON TABLE users IS 'Stores all user accounts (customers, sellers, admins)';
COMMENT ON TABLE products IS 'Product catalog with multilingual support';
COMMENT ON TABLE orders IS 'All orders with complete transaction details';
COMMENT ON TABLE returns IS 'Return and exchange requests with fraud detection';
COMMENT ON TABLE seller_payouts IS 'Weekly seller payout records';
