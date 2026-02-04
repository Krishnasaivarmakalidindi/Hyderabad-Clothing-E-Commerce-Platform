import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaTrash, FaMinus, FaPlus, FaArrowLeft, FaShoppingBag } from 'react-icons/fa';
import { ShieldCheck, Truck, Gift } from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Cart() {
    const { isLoggedIn, loading: authLoading } = useAuth();
    const { cart, loading, removeFromCart, updateQuantity } = useCart();

    // Destructure cart state
    const { items: cartItems, subtotal } = cart;

    const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
        const notification = document.createElement('div');
        notification.className = `fixed top-24 right-4 ${type === 'error' ? 'bg-vermilion' : 'bg-gold'} text-white px-6 py-3 rounded-xl shadow-xl z-50 flex items-center gap-2 font-medium`;
        // Use textContent instead of innerHTML to prevent XSS
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.classList.add('opacity-0', 'transition-opacity');
            setTimeout(() => notification.remove(), 500);
        }, 2000);
    };

    const handleRemove = async (itemId: string) => {
        const success = await removeFromCart(itemId);
        if (success) {
            showNotification('Item removed from cart');
        } else {
            showNotification('Failed to remove item', 'error');
        }
    };

    const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
        if (newQuantity < 1) {
            await handleRemove(itemId);
            return;
        }

        const success = await updateQuantity(itemId, newQuantity);
        if (!success) {
            showNotification('Failed to update quantity', 'error');
        }
    };

    if (authLoading || loading) {
        return (
            <Layout title="Shopping Cart">
                <div className="min-h-screen flex items-center justify-center bg-pearl dark:bg-gray-900">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
                </div>
            </Layout>
        );
    }

    if (!isLoggedIn) {
        return (
            <Layout title="Shopping Cart">
                <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-pearl via-white to-pearl dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-12 rounded-3xl text-center max-w-md"
                    >
                        <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                            <FaShoppingBag className="text-gold text-3xl" />
                        </div>
                        <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-2">Your cart is empty</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-8">Please log in to view your cart and start shopping.</p>
                        <Link href="/auth/login" className="inline-block px-8 py-4 bg-gold text-gray-900 rounded-full font-bold hover:bg-gold-400 transition-all shadow-lg shadow-gold/30 haptic-click">
                            Log In to View Cart
                        </Link>
                    </motion.div>
                </div>
            </Layout>
        );
    }

    if (cartItems.length === 0) {
        return (
            <Layout title="Shopping Cart">
                <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-pearl via-white to-pearl dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-12 rounded-3xl text-center max-w-md"
                    >
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 mx-auto">
                            <FaShoppingBag className="text-gray-400 text-3xl" />
                        </div>
                        <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-2">Your cart is empty</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-8">Looks like you haven't added anything to your cart yet.</p>
                        <Link href="/collections?sort=new-arrivals" className="inline-block px-8 py-4 bg-gold text-gray-900 rounded-full font-bold hover:bg-gold-400 transition-all shadow-lg shadow-gold/30 haptic-click">
                            Start Shopping
                        </Link>
                    </motion.div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout title="Shopping Cart - Hyderabad Clothing">
            <div className="bg-gradient-to-b from-pearl via-white to-pearl dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen py-12">
                <div className="container mx-auto px-4">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white mb-8"
                    >
                        Shopping Cart <span className="text-gold">({cartItems.length} items)</span>
                    </motion.h1>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Cart Items */}
                        <div className="lg:w-2/3 space-y-4">
                            {cartItems.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="glass-card spotlight-card p-5 rounded-2xl flex gap-5 items-center"
                                >
                                    <div className="w-28 h-28 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden flex-shrink-0 relative">
                                        {item.images && item.images.length > 0 ? (
                                            <img
                                                src={item.images[0]}
                                                alt={item.product_name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400">Img</div>
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-serif font-bold text-gray-900 dark:text-white text-lg">{item.product_name}</h3>
                                                <p className="text-gray-500 dark:text-gray-400 text-sm">Size: {item.size}</p>
                                            </div>
                                            <button
                                                onClick={() => handleRemove(item.id)}
                                                className="text-gray-400 hover:text-vermilion transition-colors p-2 rounded-lg hover:bg-vermilion/10 haptic-click"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>

                                        <div className="flex justify-between items-end mt-4">
                                            <div className="flex items-center glass-card rounded-xl overflow-hidden">
                                                <button
                                                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors haptic-click"
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                >
                                                    <FaMinus size={10} />
                                                </button>
                                                <span className="px-4 font-bold text-gray-900 dark:text-white">{item.quantity}</span>
                                                <button
                                                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors haptic-click"
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                >
                                                    <FaPlus size={10} />
                                                </button>
                                            </div>
                                            <div className="font-bold text-xl text-gold">{item.total}</div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            <Link href="/collections" className="inline-flex items-center gap-2 text-gold font-medium hover:gap-4 transition-all mt-6">
                                <FaArrowLeft size={14} /> Continue Shopping
                            </Link>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:w-1/3">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="glass-card p-8 rounded-3xl sticky top-24"
                            >
                                <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Subtotal</span>
                                        <span className="text-gray-900 dark:text-white font-medium">{subtotal}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Shipping</span>
                                        <span className="text-gold font-medium">Free</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Tax</span>
                                        <span>Calculated at checkout</span>
                                    </div>
                                    <div className="h-px bg-gray-200 dark:bg-gray-700 my-4"></div>
                                    <div className="flex justify-between text-xl font-bold">
                                        <span className="text-gray-900 dark:text-white">Total</span>
                                        <span className="text-gold">{subtotal}</span>
                                    </div>
                                </div>

                                <Link
                                    href="/checkout"
                                    className="block w-full py-4 bg-gold text-gray-900 rounded-full font-bold hover:bg-gold-400 transition-all shadow-lg shadow-gold/30 mb-4 text-center haptic-click"
                                >
                                    Proceed to Checkout
                                </Link>

                                <Link
                                    href="/collections"
                                    className="block w-full py-4 glass-card text-gray-700 dark:text-gray-300 rounded-full font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition-all text-center"
                                >
                                    Continue Shopping
                                </Link>

                                <div className="flex items-center justify-center gap-2 text-gray-400 text-sm mt-6">
                                    <ShieldCheck size={16} className="text-gold" />
                                    <span>Secure Checkout</span>
                                </div>

                                {/* Trust Badges */}
                                <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <div className="text-center">
                                        <ShieldCheck size={20} className="text-gold mx-auto mb-2" />
                                        <span className="text-xs text-gray-500 dark:text-gray-400">Secure</span>
                                    </div>
                                    <div className="text-center">
                                        <Truck size={20} className="text-gold mx-auto mb-2" />
                                        <span className="text-xs text-gray-500 dark:text-gray-400">Free Ship</span>
                                    </div>
                                    <div className="text-center">
                                        <Gift size={20} className="text-gold mx-auto mb-2" />
                                        <span className="text-xs text-gray-500 dark:text-gray-400">Gift Wrap</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
