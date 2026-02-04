import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import gsap from 'gsap';
import { useCart } from '../context/CartContext';

// Try to register premium plugins if available (they're optional)
let MorphSVGPlugin: any = null;
let Physics2DPlugin: any = null;

try {
    MorphSVGPlugin = require('gsap/dist/MorphSVGPlugin').default;
    gsap.registerPlugin(MorphSVGPlugin);
} catch (e) {
    console.log('MorphSVGPlugin not available (premium plugin)');
}

try {
    Physics2DPlugin = require('gsap/dist/Physics2DPlugin').default;
    gsap.registerPlugin(Physics2DPlugin);
} catch (e) {
    console.log('Physics2DPlugin not available (premium plugin)');
}

interface AddToCartButtonProps {
    productId?: number | string;
    productName?: string;
    price?: number;
    image?: string;
    size?: string;
    buildPayload?: () => { productId?: number | string; size?: string; quantity?: number; variantId?: string; productName?: string; price?: number; image?: string };
    onAdded?: () => void;
}

export default function AddToCartButton({ productId, productName, price, image, size = 'M', buildPayload, onAdded }: AddToCartButtonProps) {
    const router = useRouter();
    const buttonRef = useRef<HTMLButtonElement>(null);
    const { isInCart, addToCart } = useCart();

    // Check if product is already in cart (persisted state)
    const [isAdded, setIsAdded] = useState(false);
    const animationInProgress = useRef(false);
    const initializedRef = useRef(false);

    // Initialize button state based on cart context
    useEffect(() => {
        const payload = buildPayload ? buildPayload() : { productId, size };
        const resolvedProductId = payload.productId || productId;
        const resolvedSize = payload.size || size;

        if (resolvedProductId) {
            const inCart = isInCart(resolvedProductId, resolvedSize);
            setIsAdded(inCart);

            // Update button appearance if already in cart
            if (inCart && buttonRef.current && !initializedRef.current) {
                initializedRef.current = true;
                const button = buttonRef.current;
                const spanText = button.querySelector('span') as HTMLSpanElement;

                button.classList.add('active', 'is-go-to-cart');
                if (spanText) {
                    spanText.textContent = 'Go to Cart';
                }

                // Set initial styles for "go to cart" state
                gsap.set(button, {
                    '--cart-x': '-57px',
                    '--cart-s': 0.8,
                    '--cart-y': '-2px',
                });
            }
        }
    }, [productId, size, buildPayload, isInCart]);

    const showToast = (message: string, tone: 'success' | 'error' = 'success') => {
        const toast = document.createElement('div');
        toast.className = `fixed top-24 right-4 px-6 py-3 rounded-lg shadow-xl z-50 flex items-center gap-2 font-medium text-white transition-opacity ${tone === 'success' ? 'bg-gold' : 'bg-vermilion'
            }`;
        toast.innerText = message;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('opacity-0');
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    };

    useEffect(() => {
        const button = buttonRef.current;
        if (!button) return;

        const background = button.querySelector('.background path') as SVGPathElement;
        const spanText = button.querySelector('span') as HTMLSpanElement;

        const handlePointerDown = () => {
            if (isAdded || animationInProgress.current) return;
            gsap.to(button, {
                '--background-s': 0.97,
                duration: 0.1,
            });
        };

        const handleClick = async (e: Event) => {
            e.preventDefault();

            // If already added, redirect to cart
            if (isAdded) {
                router.push('/cart');
                return;
            }

            // Prevent multiple clicks during animation
            if (animationInProgress.current) return;

            // Build payload
            const payload = buildPayload ? buildPayload() : { productId, quantity: 1, productName, price, image, size };
            const resolvedProductId = payload.productId || productId;
            const resolvedProductName = payload.productName || productName || 'Product';
            const resolvedPrice = payload.price || price || 0;
            const resolvedImage = payload.image || image || '';
            const resolvedSize = payload.size || size || 'M';

            if (!resolvedProductId) {
                console.warn('No product id provided to AddToCartButton');
                return;
            }

            // Require auth token
            if (typeof window !== 'undefined') {
                const token = localStorage.getItem('token');
                if (!token) {
                    router.push('/auth/login');
                    return;
                }
            }

            try {
                animationInProgress.current = true;

                console.log('Adding to cart:', {
                    productId: resolvedProductId,
                    productName: resolvedProductName,
                    price: resolvedPrice,
                    image: resolvedImage,
                    size: resolvedSize,
                    quantity: payload.quantity || 1,
                });

                // Use cart context to add item (handles both API and local state)
                const success = await addToCart({
                    productId: resolvedProductId,
                    productName: resolvedProductName,
                    price: resolvedPrice,
                    image: resolvedImage,
                    size: resolvedSize,
                    quantity: payload.quantity || 1,
                    variantId: payload.variantId,
                });

                if (!success) {
                    throw new Error('Failed to add to cart');
                }

                onAdded?.();
                showToast('Added to cart');
                button.classList.add('active');

                // Simple animation that works without premium plugins
                try {
                    // Background scale animation
                    gsap.to(button, {
                        keyframes: [
                            { '--background-s': 0.97, duration: 0.1 },
                            { '--background-s': 1, delay: 0.1, duration: 0.8, ease: 'elastic.out(1, .6)' },
                        ],
                    });

                    // Simple text transition
                    gsap.to(button, {
                        '--text-o': 0,
                        duration: 0.2,
                        onComplete() {
                            if (spanText) {
                                spanText.textContent = 'Go to Cart';
                            }
                            gsap.to(button, { '--text-o': 1, duration: 0.2 });
                        }
                    });

                    // Cart icon animation (simplified without premium plugins)
                    gsap.to(button, {
                        keyframes: [
                            { '--cart-x': '-12px', '--cart-s': 1, duration: 0.25 },
                            { '--cart-x': '-57px', duration: 0.5 },
                        ],
                        onComplete() {
                            button.classList.add('is-go-to-cart');
                            setIsAdded(true);
                            animationInProgress.current = false;
                        }
                    });
                } catch (animError) {
                    // If animation fails, still update state
                    console.warn('Animation error:', animError);
                    if (spanText) {
                        spanText.textContent = 'Go to Cart';
                    }
                    button.classList.add('is-go-to-cart');
                    setIsAdded(true);
                    animationInProgress.current = false;
                }
            } catch (apiErr) {
                console.error('Add to cart failed', apiErr);
                showToast('Unable to add to cart. Please try again.', 'error');
                animationInProgress.current = false;
            }
        };

        button.addEventListener('pointerdown', handlePointerDown);
        button.addEventListener('click', handleClick);

        return () => {
            button.removeEventListener('pointerdown', handlePointerDown);
            button.removeEventListener('click', handleClick);
        };
    }, [isAdded, router, addToCart, productId, productName, price, image, size, buildPayload, onAdded]);

    return (
        <button
            ref={buttonRef}
            className="add-to-cart"
            type="button"
            aria-label={isAdded ? 'Go to cart' : 'Add to cart'}
        >
            <div className="cart">
                <svg viewBox="0 0 24 19">
                    <path
                        d="M11.25 17C11.25 17.6904 10.6904 18.25 10 18.25C9.30964 18.25 8.75 17.6904 8.75 17C8.75 16.3096 9.30964 15.75 10 15.75C10.6904 15.75 11.25 16.3096 11.25 17Z"
                        strokeWidth="1.5"
                    />
                    <path
                        d="M19.25 17C19.25 17.6904 18.6904 18.25 18 18.25C17.3096 18.25 16.75 17.6904 16.75 17C16.75 16.3096 17.3096 15.75 18 15.75C18.6904 15.75 19.25 16.3096 19.25 17Z"
                        strokeWidth="1.5"
                    />
                    <path
                        d="M1 1H5L5.91304 4M5.91304 4L8.06853 11.0823C8.32483 11.9245 9.10161 12.5 9.98188 12.5H18.585C19.4329 12.5 20.1887 11.9653 20.471 11.1656L23 4H5.91304Z"
                        strokeWidth="2"
                    />
                </svg>
                <img
                    srcSet="https://assets.codepen.io/165585/alge.png 1x, https://assets.codepen.io/165585/alge@2x.png 2x"
                    alt="Bottle"
                />
            </div>
            <span>Add to cart</span>
            <div className="check">
                <svg viewBox="0 0 10 10">
                    <path d="M2 5L4 7L8 3" />
                </svg>
            </div>
            <svg className="background" viewBox="0 0 142 46">
                <path d="M0 19C0 10.7157 6.71573 4 15 4H41.4599C53.6032 4 62.4844 4 72.5547 4C82.6251 4 91.5063 4 103.65 4H137C139.761 4 142 6.23858 142 9V31C142 39.2843 135.284 46 127 46H5C2.23858 46 0 43.7614 0 41V19Z" />
            </svg>
        </button>
    );
}

function drops(parent: HTMLElement, quantity: number, minAngle: number, maxAngle: number) {
    for (let i = quantity - 1; i >= 0; i--) {
        const angle = gsap.utils.random(minAngle, maxAngle);
        const velocity = gsap.utils.random(60, 80);

        const div = document.createElement('div');
        div.classList.add('drop');

        parent.appendChild(div);

        gsap.set(div, {
            opacity: 1,
            scale: 0,
        });

        gsap.timeline({
            onComplete() {
                div.remove();
            },
        })
            .to(
                div,
                {
                    duration: 0.4,
                    scale: gsap.utils.random(0.5, 0.7),
                },
                0
            )
            .to(
                div,
                {
                    duration: 1,
                    physics2D: {
                        angle: angle,
                        velocity: velocity,
                        gravity: 80,
                    },
                },
                0
            )
            .to(
                div,
                {
                    duration: 0.3,
                    opacity: 0,
                },
                0.3
            );
    }
}
