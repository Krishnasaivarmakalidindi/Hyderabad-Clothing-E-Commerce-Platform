import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from './AuthContext';
import api from '../lib/api';

// ===============================
// TYPES & INTERFACES
// ===============================

export interface CartItem {
    id: string;
    product_id: number | string;
    product_name: string;
    price: number;
    quantity: number;
    size: string;
    images: string[];
    total: number;
    variant_id?: string;
}

export interface CartState {
    items: CartItem[];
    subtotal: number;
    itemCount: number;
}

export interface AddToCartPayload {
    productId: number | string;
    productName: string;
    price: number;
    image: string;
    size?: string;
    quantity?: number;
    variantId?: string;
}

export interface CheckoutData {
    items: CartItem[];
    subtotal: number;
    itemCount: number;
    formattedItems: {
        id: string;
        name: string;
        price: number;
        quantity: number;
        size: string;
        image: string;
        total: number;
    }[];
}

interface CartContextType {
    cart: CartState;
    loading: boolean;
    addToCart: (product: AddToCartPayload) => Promise<boolean>;
    removeFromCart: (itemId: string) => Promise<boolean>;
    updateQuantity: (itemId: string, quantity: number) => Promise<boolean>;
    clearCart: () => Promise<boolean>;
    isInCart: (productId: number | string, size?: string) => boolean;
    getCartItem: (productId: number | string, size?: string) => CartItem | undefined;
    refreshCart: () => Promise<void>;
    getCheckoutData: () => CheckoutData;
}

// ===============================
// LOCAL STORAGE KEYS
// ===============================

const CART_STORAGE_KEY = 'hyderabad_clothing_cart';
const ADDED_PRODUCTS_KEY = 'hyderabad_clothing_added_products';

// ===============================
// HELPER FUNCTIONS
// ===============================

const getProductKey = (productId: number | string, size?: string): string => {
    return size ? `${productId}_${size}` : `${productId}`;
};

const saveToStorage = (key: string, data: any): void => {
    if (typeof window !== 'undefined') {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error('Failed to save to localStorage:', e);
        }
    }
};

const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
    if (typeof window !== 'undefined') {
        try {
            const stored = localStorage.getItem(key);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (e) {
            console.error('Failed to load from localStorage:', e);
        }
    }
    return defaultValue;
};

// ===============================
// CONTEXT CREATION
// ===============================

const CartContext = createContext<CartContextType | undefined>(undefined);

// ===============================
// PROVIDER COMPONENT
// ===============================

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const { isLoggedIn, loading: authLoading } = useAuth();

    const [cart, setCart] = useState<CartState>({
        items: [],
        subtotal: 0,
        itemCount: 0,
    });

    const [loading, setLoading] = useState(true);
    const [addedProductKeys, setAddedProductKeys] = useState<string[]>([]);
    const [initialized, setInitialized] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const storedKeys = loadFromStorage<string[]>(ADDED_PRODUCTS_KEY, []);
        setAddedProductKeys(storedKeys);

        const storedCart = loadFromStorage<CartState | null>(CART_STORAGE_KEY, null);
        if (storedCart) {
            setCart(storedCart);
        }
        setInitialized(true);
    }, []);

    // Fetch from server when logged in
    useEffect(() => {
        if (!initialized || authLoading) return;

        if (isLoggedIn) {
            refreshCartFromServer();
        } else {
            setLoading(false);
        }
    }, [isLoggedIn, authLoading, initialized]);

    const refreshCartFromServer = async () => {
        try {
            setLoading(true);
            const res = await api.get('/customer/cart');

            if (res.data.success) {
                const serverCart = res.data.data;
                const items = serverCart.items || [];

                const newCart: CartState = {
                    items,
                    subtotal: serverCart.subtotal || 0,
                    itemCount: items.reduce((acc: number, item: CartItem) => acc + item.quantity, 0),
                };

                setCart(newCart);
                saveToStorage(CART_STORAGE_KEY, newCart);

                const keys = items.map((item: CartItem) => getProductKey(item.product_id, item.size));
                setAddedProductKeys(keys);
                saveToStorage(ADDED_PRODUCTS_KEY, keys);
            }
        } catch (error) {
            console.error('Failed to fetch cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const refreshCart = useCallback(async (): Promise<void> => {
        if (isLoggedIn) {
            await refreshCartFromServer();
        }
    }, [isLoggedIn]);

    // Helper function to add item to local cart
    const addToLocalCart = useCallback((product: AddToCartPayload) => {
        const { productId, productName, price, image, size = 'M', quantity = 1, variantId } = product;

        setCart(prevCart => {
            const existingIndex = prevCart.items.findIndex(
                item => item.product_id.toString() === productId.toString() && item.size === size
            );

            let updatedItems: CartItem[];

            if (existingIndex >= 0) {
                updatedItems = prevCart.items.map((item, index) =>
                    index === existingIndex
                        ? {
                            ...item,
                            quantity: item.quantity + quantity,
                            total: (item.quantity + quantity) * item.price,
                        }
                        : item
                );
            } else {
                const newItem: CartItem = {
                    id: `local_${Date.now()}_${productId}`,
                    product_id: productId,
                    product_name: productName,
                    price,
                    quantity,
                    size,
                    images: [image],
                    total: price * quantity,
                    variant_id: variantId,
                };
                updatedItems = [...prevCart.items, newItem];
            }

            const newCart: CartState = {
                items: updatedItems,
                subtotal: updatedItems.reduce((acc, item) => acc + item.total, 0),
                itemCount: updatedItems.reduce((acc, item) => acc + item.quantity, 0),
            };

            saveToStorage(CART_STORAGE_KEY, newCart);
            return newCart;
        });
    }, []);

    const addToCart = useCallback(async (product: AddToCartPayload): Promise<boolean> => {
        const { productId, productName, price, image, size = 'M', quantity = 1, variantId } = product;
        const productKey = getProductKey(productId, size);

        console.log('CartContext.addToCart called:', { product, isLoggedIn });

        try {
            if (isLoggedIn) {
                console.log('Making API call to add to cart...');
                try {
                    await api.post('/customer/cart', {
                        productId,
                        size,
                        quantity,
                        variantId,
                    });
                    console.log('API call successful, refreshing cart...');
                    await refreshCartFromServer();
                } catch (apiError) {
                    // API failed - fallback to localStorage
                    console.warn('API unavailable, using localStorage fallback:', apiError);
                    addToLocalCart(product);
                }
            } else {
                addToLocalCart(product);
            }

            // Update added products tracking
            setAddedProductKeys(prevKeys => {
                if (!prevKeys.includes(productKey)) {
                    const newKeys = [...prevKeys, productKey];
                    saveToStorage(ADDED_PRODUCTS_KEY, newKeys);
                    return newKeys;
                }
                return prevKeys;
            });

            return true;
        } catch (error) {
            console.error('Failed to add to cart:', error);
            return false;
        }
    }, [isLoggedIn, addToLocalCart]);

    // Helper function to remove item from local cart
    const removeFromLocalCart = useCallback((itemId: string): CartItem | undefined => {
        let removedItem: CartItem | undefined;
        setCart(prevCart => {
            removedItem = prevCart.items.find(item => item.id === itemId);
            const updatedItems = prevCart.items.filter(item => item.id !== itemId);

            const newCart: CartState = {
                items: updatedItems,
                subtotal: updatedItems.reduce((acc, item) => acc + item.total, 0),
                itemCount: updatedItems.reduce((acc, item) => acc + item.quantity, 0),
            };

            saveToStorage(CART_STORAGE_KEY, newCart);
            return newCart;
        });
        return removedItem;
    }, []);

    // Helper function to update quantity in local cart
    const updateQuantityLocal = useCallback((itemId: string, quantity: number) => {
        setCart(prevCart => {
            const updatedItems = prevCart.items.map(item =>
                item.id === itemId
                    ? { ...item, quantity, total: item.price * quantity }
                    : item
            );

            const newCart: CartState = {
                items: updatedItems,
                subtotal: updatedItems.reduce((acc, item) => acc + item.total, 0),
                itemCount: updatedItems.reduce((acc, item) => acc + item.quantity, 0),
            };

            saveToStorage(CART_STORAGE_KEY, newCart);
            return newCart;
        });
    }, []);

    const removeFromCart = useCallback(async (itemId: string): Promise<boolean> => {
        try {
            let removedItem: CartItem | undefined;

            if (isLoggedIn) {
                removedItem = cart.items.find(item => item.id === itemId);
                try {
                    await api.delete(`/customer/cart/${itemId}`);
                    await refreshCartFromServer();
                } catch (apiError) {
                    console.warn('API unavailable, using localStorage fallback:', apiError);
                    removedItem = removeFromLocalCart(itemId);
                }
            } else {
                removedItem = removeFromLocalCart(itemId);
            }

            if (removedItem) {
                const productKey = getProductKey(removedItem.product_id, removedItem.size);
                setAddedProductKeys(prevKeys => {
                    const newKeys = prevKeys.filter(key => key !== productKey);
                    saveToStorage(ADDED_PRODUCTS_KEY, newKeys);
                    return newKeys;
                });
            }

            return true;
        } catch (error) {
            console.error('Failed to remove from cart:', error);
            return false;
        }
    }, [isLoggedIn, cart.items, removeFromLocalCart]);

    const updateQuantity = useCallback(async (itemId: string, quantity: number): Promise<boolean> => {
        if (quantity < 1) {
            return removeFromCart(itemId);
        }

        try {
            if (isLoggedIn) {
                try {
                    await api.put(`/customer/cart/${itemId}`, { quantity });
                    await refreshCartFromServer();
                } catch (apiError) {
                    console.warn('API unavailable, using localStorage fallback:', apiError);
                    updateQuantityLocal(itemId, quantity);
                }
            } else {
                updateQuantityLocal(itemId, quantity);
            }

            return true;
        } catch (error) {
            console.error('Failed to update quantity:', error);
            return false;
        }
    }, [isLoggedIn, removeFromCart, updateQuantityLocal]);

    const clearCart = useCallback(async (): Promise<boolean> => {
        try {
            if (isLoggedIn) {
                await api.delete('/customer/cart');
            }

            const emptyCart: CartState = { items: [], subtotal: 0, itemCount: 0 };
            setCart(emptyCart);
            saveToStorage(CART_STORAGE_KEY, emptyCart);

            setAddedProductKeys([]);
            saveToStorage(ADDED_PRODUCTS_KEY, []);

            return true;
        } catch (error) {
            console.error('Failed to clear cart:', error);
            return false;
        }
    }, [isLoggedIn]);

    const isInCart = useCallback((productId: number | string, size?: string): boolean => {
        const productKey = getProductKey(productId, size);
        return addedProductKeys.includes(productKey);
    }, [addedProductKeys]);

    const getCartItem = useCallback((productId: number | string, size?: string): CartItem | undefined => {
        return cart.items.find(
            item => item.product_id.toString() === productId.toString() && (!size || item.size === size)
        );
    }, [cart.items]);

    const getCheckoutData = useCallback((): CheckoutData => {
        return {
            items: cart.items,
            subtotal: cart.subtotal,
            itemCount: cart.itemCount,
            formattedItems: cart.items.map(item => ({
                id: item.id,
                name: item.product_name,
                price: item.price,
                quantity: item.quantity,
                size: item.size,
                image: item.images[0] || '',
                total: item.total,
            })),
        };
    }, [cart]);

    const value: CartContextType = {
        cart,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
        getCartItem,
        refreshCart,
        getCheckoutData,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export default CartContext;
