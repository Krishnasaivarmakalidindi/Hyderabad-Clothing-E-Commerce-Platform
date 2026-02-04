import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

// Fail loudly in production if API URL not set
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_API_URL) {
    console.error('NEXT_PUBLIC_API_URL is not set in production!');
}

// CSRF token management
let csrfToken: string | null = null;

// Fetch CSRF token from server
const fetchCsrfToken = async (apiInstance: AxiosInstance): Promise<string | null> => {
    try {
        // Remove /api/v1 to get base URL for CSRF endpoint
        const baseUrl = API_URL.replace(/\/api\/v\d+$/, '');
        const response = await axios.get(`${baseUrl}/api/csrf-token`, {
            withCredentials: true,
        });
        csrfToken = response.data.csrfToken;
        return csrfToken;
    } catch (error) {
        console.warn('Failed to fetch CSRF token');
        return null;
    }
};

// Create axios instance with credentials
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Send cookies with requests
});

// Request interceptor to add auth token and CSRF token
api.interceptors.request.use(
    async (config) => {
        // Add Authorization header from localStorage for backward compatibility
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            // Add CSRF token for state-changing requests
            if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(config.method?.toUpperCase() || '')) {
                // Fetch CSRF token if not available
                if (!csrfToken) {
                    await fetchCsrfToken(api);
                }
                if (csrfToken) {
                    config.headers['X-CSRF-Token'] = csrfToken;
                }
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling and token refresh
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        if (typeof window !== 'undefined') {
            // Handle 401 Unauthorized
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                // Try to refresh the token
                try {
                    const refreshResponse = await api.post('/auth/refresh-token');
                    if (refreshResponse.data.success && refreshResponse.data.data.token) {
                        // Update localStorage token
                        localStorage.setItem('token', refreshResponse.data.data.token);

                        // Retry original request
                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.data.token}`;
                        }
                        return api(originalRequest);
                    }
                } catch (refreshError) {
                    // Refresh failed - clear session and redirect
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/auth/login';
                    return Promise.reject(error);
                }
            }

            // Handle 403 CSRF error - fetch new token and retry
            if (error.response?.status === 403 && (error.response?.data as any)?.code === 'CSRF_INVALID') {
                csrfToken = null;
                await fetchCsrfToken(api);
                if (csrfToken && originalRequest) {
                    if (originalRequest.headers) {
                        originalRequest.headers['X-CSRF-Token'] = csrfToken;
                    }
                    return api(originalRequest);
                }
            }
        }

        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (data: any) => api.post('/auth/register', data),
    login: (data: any) => api.post('/auth/login', data),
    logout: () => api.post('/auth/logout'),
    logoutAll: () => api.post('/auth/logout-all'),
    getMe: () => api.get('/auth/me'),
    refreshToken: () => api.post('/auth/refresh-token'),
    forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
    resetPassword: (token: string, password: string) =>
        api.post(`/auth/reset-password/${token}`, { password }),
};

// Products API
export const productsAPI = {
    getAll: (params?: any) => api.get('/products', { params }),
    getById: (id: string) => api.get(`/products/${id}`),
    getSizeRecommendation: (id: string, params?: any) =>
        api.get(`/products/${id}/size-recommendation`, { params }),
    askSeller: (id: string, message: string) =>
        api.post(`/products/${id}/ask-seller`, { message }),
};

// Orders API
export const ordersAPI = {
    create: (data: any) => api.post('/orders', data),
    getMyOrders: (params?: any) => api.get('/orders', { params }),
    getById: (id: string) => api.get(`/orders/${id}`),
    cancel: (id: string, reason: string) =>
        api.patch(`/orders/${id}/cancel`, { reason }),
};

// Returns API
export const returnsAPI = {
    create: (data: any) => api.post('/returns', data),
    getMyReturns: (params?: any) => api.get('/returns', { params }),
    getById: (id: string) => api.get(`/returns/${id}`),
};

// Customer API
export const customerAPI = {
    addToCart: (data: any) => api.post('/customer/cart', data),
    getCart: () => api.get('/customer/cart'),
    removeFromCart: (itemId: string) => api.delete(`/customer/cart/${itemId}`),
    updateCartQuantity: (itemId: string, quantity: number) => api.put(`/customer/cart/${itemId}`, { quantity }),
    clearCart: () => api.delete('/customer/cart'),
    updateSizeData: (data: any) => api.put('/customer/profile/size-data', data),
    getProfile: () => api.get('/customer/profile'),
};

// Initialize CSRF token on first load
if (typeof window !== 'undefined') {
    fetchCsrfToken(api);
}

export default api;
