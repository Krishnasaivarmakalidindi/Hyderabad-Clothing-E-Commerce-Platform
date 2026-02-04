-- Migration: Update carts table to support size field and make variant_id optional
-- Date: 2026-01-08

BEGIN;

-- Make variant_id optional
ALTER TABLE carts ALTER COLUMN variant_id DROP NOT NULL;

-- Add size column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'carts' AND column_name = 'size'
    ) THEN
        ALTER TABLE carts ADD COLUMN size VARCHAR(50);
    END IF;
END $$;

-- Drop old unique constraint on customer_id and variant_id
ALTER TABLE carts DROP CONSTRAINT IF EXISTS carts_customer_id_variant_id_key;

-- Add new unique constraint on customer_id, product_id, and size
ALTER TABLE carts DROP CONSTRAINT IF EXISTS carts_customer_product_size_unique;
ALTER TABLE carts ADD CONSTRAINT carts_customer_product_size_unique 
    UNIQUE(customer_id, product_id, size);

COMMIT;
