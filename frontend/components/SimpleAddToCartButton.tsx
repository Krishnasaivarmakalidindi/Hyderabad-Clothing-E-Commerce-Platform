import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '../context/CartContext';
import { FaShoppingCart, FaCheck } from 'react-icons/fa';

interface AddToCartButtonProps {
    productId?: number | string;
    productName?: string;
    price?: number;
    image?: string;
    size?: string;
    buildPayload?: () => {
        productId?: number | string;
        size?: string;
        quantity?: number;
        variantId?: string;
        productName?: string;
        price?: number;
        image?: string;
    };
    onAdded?: () => void;
    className?: string;
}

export default function SimpleAddToCartButton({
    productId,
    productName,
    price,
    image,
    size = 'M',
    buildPayload,
    onAdded,
    className = '',
}: AddToCartButtonProps) {
    const router = useRouter();
    const { isInCart, addToCart } = useCart();
    const [isAdded, setIsAdded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Check if product is already in cart on mount and when cart changes
    useEffect(() => {
        const payload = buildPayload ? buildPayload() : { productId, size };
        const resolvedProductId = payload.productId || productId;
        const resolvedSize = payload.size || size;

        if (resolvedProductId) {
            const inCart = isInCart(resolvedProductId, resolvedSize);
            setIsAdded(inCart);
        }
    }, [productId, size, buildPayload, isInCart]);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        const toast = document.createElement('div');
        toast.className = `fixed top-24 right-4 px-6 py-3 rounded-lg shadow-xl z-50 flex items-center gap-2 font-medium text-white transition-all duration-300 ${type === 'success' ? 'bg-gold' : 'bg-vermilion'
            }`;
        toast.innerText = message;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    };

    const handleClick = async () => {
        // If already added, go to cart
        if (isAdded) {
            router.push('/cart');
            return;
        }

        // Check for auth
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/auth/login');
                return;
            }
        }

        // Build payload
        const payload = buildPayload ? buildPayload() : { productId, quantity: 1, productName, price, image, size };
        const resolvedProductId = payload.productId || productId;
        const resolvedProductName = payload.productName || productName || 'Product';
        const resolvedPrice = payload.price || price || 0;
        const resolvedImage = payload.image || image || '';
        const resolvedSize = payload.size || size || 'M';

        if (!resolvedProductId) {
            console.warn('No product ID provided');
            return;
        }

        setIsLoading(true);

        try {
            console.log('Adding to cart:', {
                productId: resolvedProductId,
                productName: resolvedProductName,
                price: resolvedPrice,
                size: resolvedSize,
            });

            const success = await addToCart({
                productId: resolvedProductId,
                productName: resolvedProductName,
                price: resolvedPrice,
                image: resolvedImage,
                size: resolvedSize,
                quantity: payload.quantity || 1,
                variantId: payload.variantId,
            });

            if (success) {
                setIsAdded(true);
                showToast('Added to cart!', 'success');
                onAdded?.();
            } else {
                showToast('Failed to add to cart', 'error');
            }
        } catch (error) {
            console.error('Add to cart error:', error);
            showToast('Failed to add to cart', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={isLoading}
            className={`
                relative flex items-center justify-center gap-2
                px-8 py-4 rounded-xl font-bold text-white
                transition-all duration-300 transform
                ${isAdded
                    ? 'bg-gold hover:bg-gold-600'
                    : 'bg-vermilion hover:bg-vermilion-600 hover:scale-105'
                }
                ${isLoading ? 'opacity-70 cursor-wait' : 'cursor-pointer'}
                disabled:opacity-50 disabled:cursor-not-allowed
                shadow-lg hover:shadow-xl
                ${className}
            `}
            aria-label={isAdded ? 'Go to cart' : 'Add to cart'}
        >
            {isLoading ? (
                <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Adding...</span>
                </>
            ) : isAdded ? (
                <>
                    <FaCheck className="text-lg" />
                    <span>Go to Cart</span>
                </>
            ) : (
                <>
                    <FaShoppingCart className="text-lg" />
                    <span>Add to Cart</span>
                </>
            )}
        </button>
    );
}
