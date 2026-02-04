import { Pool, PoolClient, QueryResult } from 'pg';
import { env } from './env.js';
import logger from '../utils/logger.js';

// Database connection pool with proper timeouts
const pool = new Pool({
    host: env.DB_HOST,
    port: env.DB_PORT,
    database: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 5000, // Fail fast if no connection in 5 seconds
    allowExitOnIdle: false, // Don't exit when all clients are idle
});

// Track pool statistics
let queryCount = 0;
let errorCount = 0;

// Test database connection
pool.on('connect', () => {
    logger.info('Database client connected');
});

pool.on('error', (err: Error) => {
    errorCount++;
    logger.error('Unexpected error on idle database client', { error: err.message });
    // Don't exit - allow server to gracefully handle DB issues
});

pool.on('acquire', () => {
    // Client acquired from pool
});

pool.on('remove', () => {
    // Client removed from pool
});

// Query helper function with logging and metrics
export const query = async (text: string, params?: any[]): Promise<QueryResult> => {
    const start = Date.now();
    queryCount++;

    try {
        const res = await pool.query(text, params);
        const duration = Date.now() - start;

        // Log slow queries (>100ms)
        if (duration > 100) {
            logger.warn('Slow query detected', {
                duration,
                query: text.substring(0, 100),
                rows: res.rowCount,
            });
        } else if (env.NODE_ENV === 'development') {
            logger.debug('Executed query', {
                query: text.substring(0, 50),
                duration,
                rows: res.rowCount,
            });
        }

        return res;
    } catch (error: any) {
        errorCount++;
        logger.error('Database query error', {
            error: error.message,
            query: text.substring(0, 100),
        });
        throw error;
    }
};

// Transaction helper with timeout
export const transaction = async <T>(
    callback: (client: PoolClient) => Promise<T>,
    timeoutMs: number = 30000
): Promise<T> => {
    const client = await pool.connect();

    // Set statement timeout for long-running queries
    await client.query(`SET statement_timeout = ${timeoutMs}`);

    try {
        await client.query('BEGIN');
        const result = await callback(client);
        await client.query('COMMIT');
        return result;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

// Get a client from the pool
export const getClient = async (): Promise<PoolClient> => {
    return await pool.connect();
};

// Close all connections
export const closePool = async (): Promise<void> => {
    await pool.end();
    logger.info('Database pool closed');
};

// Health check function
export const healthCheck = async (): Promise<{ connected: boolean; stats: object }> => {
    try {
        await pool.query('SELECT 1');
        return {
            connected: true,
            stats: {
                totalCount: pool.totalCount,
                idleCount: pool.idleCount,
                waitingCount: pool.waitingCount,
                queryCount,
                errorCount,
            },
        };
    } catch (error) {
        return {
            connected: false,
            stats: { error: (error as Error).message },
        };
    }
};

// Get pool statistics
export const getPoolStats = () => ({
    totalCount: pool.totalCount,
    idleCount: pool.idleCount,
    waitingCount: pool.waitingCount,
    queryCount,
    errorCount,
});

export default pool;
