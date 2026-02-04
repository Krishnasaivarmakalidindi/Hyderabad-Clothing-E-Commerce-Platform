/**
 * Admin User Seed Script
 *
 * Creates an admin user with credentials from environment variables.
 * Run with: npx ts-node database/seed_admin.ts
 *
 * Required environment variables:
 * - ADMIN_EMAIL: Admin email address
 * - ADMIN_PASSWORD: Admin password (will be hashed)
 * - ADMIN_PHONE: Admin phone number
 * - ADMIN_NAME: Admin full name
 * - DATABASE_URL or DB_* variables
 */

import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '../backend/.env' });

interface AdminConfig {
    email: string;
    password: string;
    phone: string;
    name: string;
}

async function getAdminConfig(): Promise<AdminConfig> {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const phone = process.env.ADMIN_PHONE || '+919876543210';
    const name = process.env.ADMIN_NAME || 'Platform Admin';

    if (!email) {
        throw new Error('ADMIN_EMAIL environment variable is required');
    }

    if (!password) {
        throw new Error('ADMIN_PASSWORD environment variable is required');
    }

    // Validate password strength
    if (password.length < 12) {
        throw new Error('ADMIN_PASSWORD must be at least 12 characters long');
    }

    if (!/[A-Z]/.test(password)) {
        throw new Error('ADMIN_PASSWORD must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
        throw new Error('ADMIN_PASSWORD must contain at least one lowercase letter');
    }

    if (!/[0-9]/.test(password)) {
        throw new Error('ADMIN_PASSWORD must contain at least one number');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        throw new Error('ADMIN_PASSWORD must contain at least one special character');
    }

    return { email, password, phone, name };
}

async function seedAdmin(): Promise<void> {
    console.log('🔐 Starting admin user seed...\n');

    // Get and validate admin config
    const adminConfig = await getAdminConfig();
    console.log(`📧 Admin email: ${adminConfig.email}`);
    console.log(`📱 Admin phone: ${adminConfig.phone}`);
    console.log(`👤 Admin name: ${adminConfig.name}`);

    // Create database connection
    const pool = new Pool({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME || 'hyderabad_clothing',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD,
    });

    try {
        // Hash password
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);
        console.log(`\n🔑 Hashing password with ${saltRounds} salt rounds...`);
        const passwordHash = await bcrypt.hash(adminConfig.password, saltRounds);

        // Check if admin already exists
        const existingAdmin = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [adminConfig.email]
        );

        if (existingAdmin.rows.length > 0) {
            console.log('\n⚠️  Admin user already exists. Updating password...');

            await pool.query(
                `UPDATE users
                 SET password_hash = $1,
                     full_name = $2,
                     phone_number = $3,
                     updated_at = NOW()
                 WHERE email = $4`,
                [passwordHash, adminConfig.name, adminConfig.phone, adminConfig.email]
            );

            console.log('✅ Admin user password updated successfully!');
        } else {
            console.log('\n📝 Creating new admin user...');

            await pool.query(
                `INSERT INTO users (
                    email,
                    phone_number,
                    password_hash,
                    full_name,
                    user_type,
                    is_active,
                    is_verified
                ) VALUES ($1, $2, $3, $4, 'admin', true, true)`,
                [adminConfig.email, adminConfig.phone, passwordHash, adminConfig.name]
            );

            console.log('✅ Admin user created successfully!');
        }

        console.log('\n🎉 Admin seed completed successfully!');
        console.log('\n⚠️  IMPORTANT: Keep your ADMIN_PASSWORD environment variable secure!');
        console.log('⚠️  Consider removing it from .env after initial setup.\n');

    } catch (error) {
        console.error('\n❌ Error seeding admin user:', error);
        throw error;
    } finally {
        await pool.end();
    }
}

// Run if called directly
seedAdmin()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
