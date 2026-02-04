import { Request } from 'express';

declare global {
    namespace Express {
        interface Request {
            id?: string;
            user?: {
                id: string;
                email: string;
                userType: 'customer' | 'seller' | 'admin';
                fullName?: string;
            };
        }
    }
}

export {};
