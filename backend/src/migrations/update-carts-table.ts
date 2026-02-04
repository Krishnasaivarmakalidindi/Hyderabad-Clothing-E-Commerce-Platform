import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'hyderabad_clothing',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
});

async function runMigration() {
    const client = await pool.connect();

    try {
        console.log('🔄 Starting carts table migration...');

        await client.query('BEGIN');

        // Make variant_id optional
        console.log('  ✓ Making variant_id nullable...');
        await client.query('ALTER TABLE carts ALTER COLUMN variant_id DROP NOT NULL');

        // Add size column
        console.log('  ✓ Adding size column...');
        await client.query(`
            DO $$ 
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.columns 
                    WHERE table_name = 'carts' AND column_name = 'size'
                ) THEN
                    ALTER TABLE carts ADD COLUMN size VARCHAR(50);
                END IF;
            END $$;
        `);

        // Drop old unique constraint
        console.log('  ✓ Dropping old unique constraint...');
        await client.query('ALTER TABLE carts DROP CONSTRAINT IF EXISTS carts_customer_id_variant_id_key');

        // Add new unique constraint
        console.log('  ✓ Adding new unique constraint...');
        await client.query('ALTER TABLE carts DROP CONSTRAINT IF EXISTS carts_customer_product_size_unique');
        await client.query(`
            ALTER TABLE carts ADD CONSTRAINT carts_customer_product_size_unique 
            UNIQUE(customer_id, product_id, size)
        `);

        await client.query('COMMIT');

        console.log('✅ Migration completed successfully!');

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Migration failed:', error);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

runMigration()
    .then(() => {
        console.log('Migration script finished.');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Migration script failed:', error);
        process.exit(1);
    });
