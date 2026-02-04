import { createClient, RedisClientType } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

let redisClient: any = null;
let redisAvailable = false;
let connectionAttempted = false;

export const connectRedis = async (): Promise<any> => {
    if (redisClient) {
        return redisClient;
    }

    if (connectionAttempted && !redisAvailable) {
        return null;
    }

    connectionAttempted = true;

    try {
        const client = createClient({
            socket: {
                host: process.env.REDIS_HOST || 'localhost',
                port: parseInt(process.env.REDIS_PORT || '6379'),
                connectTimeout: 2000,
                reconnectStrategy: (retries) => {
                    // In development, don't retry if initial connection fails
                    if (process.env.NODE_ENV === 'development' && retries > 0) {
                        return false;
                    }
                    // In production, retry with exponential backoff
                    return Math.min(retries * 100, 3000);
                },
            },
            password: process.env.REDIS_PASSWORD || undefined,
        });

        client.on('connect', () => {
            console.log('✅ Redis connected successfully');
        });

        client.on('error', (err) => {
            // Only log once to avoid spam
            if (redisAvailable) {
                console.error('❌ Redis connection error:', err.message);
            }
        });

        await client.connect();
        redisClient = client;
        redisAvailable = true;

        return client;
    } catch (error: any) {
        if (process.env.NODE_ENV === 'development') {
            console.warn('⚠️  Redis not available - running without Redis (token blacklisting disabled)');
            console.warn('   To enable Redis, run: docker compose up redis -d');
            redisAvailable = false;
            return null;
        }
        throw error;
    }
};

// Helper to check if Redis is available
const ensureRedis = async (): Promise<boolean> => {
    if (!redisClient && !connectionAttempted) {
        await connectRedis();
    }
    return redisAvailable && redisClient !== null;
};

// Cache helper functions
export const cacheGet = async (key: string): Promise<string | null> => {
    if (!(await ensureRedis())) return null;
    return await redisClient.get(key);
};

export const cacheSet = async (
    key: string,
    value: string,
    expirationInSeconds?: number
): Promise<void> => {
    if (!(await ensureRedis())) return;

    if (expirationInSeconds) {
        await redisClient.setEx(key, expirationInSeconds, value);
    } else {
        await redisClient.set(key, value);
    }
};

export const cacheDel = async (key: string): Promise<void> => {
    if (!(await ensureRedis())) return;
    await redisClient.del(key);
};

export const cacheFlush = async (): Promise<void> => {
    if (!(await ensureRedis())) return;
    await redisClient.flushAll();
};

// Token blacklist functions for logout
export const blacklistToken = async (token: string, expiresInSeconds: number): Promise<void> => {
    if (!(await ensureRedis())) return;
    await redisClient.setEx(`blacklist:${token}`, expiresInSeconds, 'true');
};

export const isTokenBlacklisted = async (token: string): Promise<boolean> => {
    if (!(await ensureRedis())) return false;
    const result = await redisClient.get(`blacklist:${token}`);
    return result === 'true';
};

// Password reset token functions
export const storeResetToken = async (userId: string, token: string, expiresInSeconds: number): Promise<void> => {
    if (!(await ensureRedis())) return;
    await redisClient.setEx(`reset:${token}`, expiresInSeconds, userId);
};

export const getResetTokenUserId = async (token: string): Promise<string | null> => {
    if (!(await ensureRedis())) return null;
    return await redisClient.get(`reset:${token}`);
};

export const deleteResetToken = async (token: string): Promise<void> => {
    if (!(await ensureRedis())) return;
    await redisClient.del(`reset:${token}`);
};

// Refresh token storage
export const storeRefreshToken = async (userId: string, token: string, expiresInSeconds: number): Promise<void> => {
    if (!(await ensureRedis())) return;
    await redisClient.setEx(`refresh:${userId}:${token}`, expiresInSeconds, 'valid');
};

export const isRefreshTokenValid = async (userId: string, token: string): Promise<boolean> => {
    if (!(await ensureRedis())) return true; // Allow in dev mode without Redis
    const result = await redisClient.get(`refresh:${userId}:${token}`);
    return result === 'valid';
};

export const revokeRefreshToken = async (userId: string, token: string): Promise<void> => {
    if (!(await ensureRedis())) return;
    await redisClient.del(`refresh:${userId}:${token}`);
};

export const revokeAllUserRefreshTokens = async (userId: string): Promise<void> => {
    if (!(await ensureRedis())) return;
    const keys = await redisClient.keys(`refresh:${userId}:*`);
    if (keys.length > 0) {
        await redisClient.del(keys);
    }
};

export const getRedisClient = (): RedisClientType | null => {
    if (!redisClient || !redisAvailable) {
        return null;
    }
    return redisClient;
};

export const isRedisAvailable = (): boolean => redisAvailable;

export default {
    connectRedis,
    cacheGet,
    cacheSet,
    cacheDel,
    cacheFlush,
    getRedisClient,
    blacklistToken,
    isTokenBlacklisted,
    storeResetToken,
    getResetTokenUserId,
    deleteResetToken,
    storeRefreshToken,
    isRefreshTokenValid,
    revokeRefreshToken,
    revokeAllUserRefreshTokens,
};
