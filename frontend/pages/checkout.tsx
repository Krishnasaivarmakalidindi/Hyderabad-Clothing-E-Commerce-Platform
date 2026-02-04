import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaMapMarkerAlt, FaCreditCard, FaTruck, FaCheckCircle, FaMoneyBillAlt } from 'react-icons/fa';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useCart, CheckoutData } from '../context/CartContext';
import api from '../lib/api';

export default function Checkout() {
    const { user, isLoggedIn, loading: authLoading } = useAuth();
    const { cart, loading: cartLoading, getCheckoutData, clearCart, refreshCart } = useCart();
    const router = useRouter();

    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    const showToast = (message: string, tone: 'success' | 'error' = 'success') => {
        const toast = document.createElement('div');
        toast.className = `fixed top-24 right-4 px-6 py-3 rounded-lg shadow-xl z-50 flex items-center gap-2 font-medium text-white transition-opacity ${tone === 'success' ? 'bg-gold' : 'bg-vermilion'
            }`;
        toast.innerText = message;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('opacity-0');
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    };

    useEffect(() => {
        if (!authLoading && !isLoggedIn) {
            router.push('/auth/login?redirect=/checkout');
            return;
        }

        if (isLoggedIn && !cartLoading) {
            fetchAddresses();

            // Redirect to cart if empty
            if (cart.items.length === 0) {
                router.push('/cart');
            }
        }
    }, [isLoggedIn, authLoading, cartLoading, cart.items.length]);

    const fetchAddresses = async () => {
        try {
            const addrRes = await api.get('/customer/addresses');

            if (addrRes.data.success) {
                setAddresses(addrRes.data.data);
                const defaultAddr = addrRes.data.data.find((a: any) => a.is_default);
                if (defaultAddr) setSelectedAddressId(defaultAddr.id);
                else if (addrRes.data.data.length > 0) setSelectedAddressId(addrRes.data.data[0].id);
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handle checkout - passes cart data to payment module
     * This function safely prepares and validates checkout data before processing
     */
    const handlePlaceOrder = async () => {
        // Validation checks
        if (!selectedAddressId) {
            showToast('Please select a delivery address', 'error');
            return;
        }

        if (cart.items.length === 0) {
            showToast('Your cart is empty', 'error');
            return;
        }

        setProcessing(true);
        const failedItems: string[] = [];

        // Get formatted checkout data from cart context
        const checkoutData: CheckoutData = getCheckoutData();

        // Log checkout data for debugging (can be removed in production)
        console.log('Checkout Data:', {
            items: checkoutData.formattedItems,
            subtotal: checkoutData.subtotal,
            itemCount: checkoutData.itemCount,
            deliveryAddressId: selectedAddressId,
            paymentMethod,
        });

        try {
            // Process each item as a separate order (or batch if your API supports it)
            for (const item of cart.items) {
                try {
                    // Fetch product details to get variant information
                    const productRes = await api.get(`/products/${item.product_id}`);
                    const product = productRes.data?.data;
                    const variant = product?.variants?.find((v: any) => v.size === item.size) || product?.variants?.[0];

                    if (!variant?.id) {
                        failedItems.push(item.product_name || `Product ${item.product_id}`);
                        continue;
                    }

                    // Create order with payment data
                    const orderPayload = {
                        variantId: variant.id,
                        quantity: item.quantity,
                        deliveryAddressId: selectedAddressId,
                        paymentMethod,
                        // Additional data for payment module
                        amount: item.total,
                        productName: item.product_name,
                    };

                    await api.post('/orders', orderPayload);
                } catch (itemErr) {
                    console.error('Order item failed:', itemErr);
                    failedItems.push(item.product_name || `Product ${item.product_id}`);
                }
            }

            // Clear cart after successful checkout
            await clearCart();

            if (failedItems.length === 0) {
                showToast('Order placed successfully');

                // Pass order summary to success page
                router.push({
                    pathname: '/order-success',
                    query: {
                        total: checkoutData.subtotal,
                        items: checkoutData.itemCount,
                    },
                });
            } else {
                showToast(`Placed order except: ${failedItems.join(', ')}`, 'error');
                // Refresh cart to show remaining items
                await refreshCart();
            }
        } catch (error) {
            console.error('Order failed:', error);
            showToast('We could not place your order. Please try again.', 'error');
        } finally {
            setProcessing(false);
        }
    };

    /**
     * Handle online payment - integrates with payment gateway
     * This can be extended to work with Razorpay, Stripe, etc.
     */
    const handleOnlinePayment = async () => {
        const checkoutData = getCheckoutData();

        // Prepare payment data
        const paymentData = {
            amount: checkoutData.subtotal * 100, // Convert to paise for Indian payment gateways
            currency: 'INR',
            items: checkoutData.formattedItems,
            customerEmail: user?.email,
            customerPhone: user?.phoneNumber,
            deliveryAddressId: selectedAddressId,
        };

        // Here you would integrate with your payment gateway
        // Example for Razorpay:
        // const options = {
        //     key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        //     amount: paymentData.amount,
        //     currency: paymentData.currency,
        //     name: 'Hyderabad Clothing',
        //     description: `Order of ${paymentData.items.length} items`,
        //     handler: async (response: any) => {
        //         // Verify payment on server and create order
        //         await handlePlaceOrder();
        //     },
        // };
        // const razorpay = new Razorpay(options);
        // razorpay.open();

        // For now, fall back to regular order placement
        await handlePlaceOrder();
    };

    /**
     * Main checkout handler - routes to appropriate payment method
     */
    const handleCheckout = async () => {
        if (paymentMethod === 'online') {
            await handleOnlinePayment();
        } else {
            await handlePlaceOrder();
        }
    };

    if (authLoading || loading) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center bg-cream-50 dark:bg-[#121212]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout title="Checkout - Hyderabad Clothing">
            <div className="bg-cream-50 dark:bg-[#121212] min-h-screen py-10">
                <div className="container mx-auto px-4 md:px-6">
                    <h1 className="text-3xl font-black text-brown-900 dark:text-white mb-8">Checkout</h1>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Column: Address & Payment */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Address Section */}
                            <div className="bg-white dark:bg-[#1A1A1A] p-6 rounded-xl shadow-sm dark:shadow-black/20 border border-cream-200 dark:border-gray-800">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-brown-900 dark:text-white flex items-center gap-2">
                                        <FaMapMarkerAlt className="text-vermilion" /> Delivery Address
                                    </h2>
                                    <button
                                        onClick={() => router.push('/profile?tab=addresses')}
                                        className="text-sm font-medium text-vermilion hover:underline"
                                    >
                                        + Add / Manage
                                    </button>
                                </div>

                                {addresses.length > 0 ? (
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {addresses.map((addr: any) => (
                                            <div
                                                key={addr.id}
                                                onClick={() => setSelectedAddressId(addr.id)}
                                                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedAddressId === addr.id
                                                    ? 'border-vermilion bg-vermilion/10'
                                                    : 'border-cream-200 dark:border-gray-700 hover:border-brown-300 dark:hover:border-gray-600'
                                                    }`}
                                            >
                                                <div className="flex justify-between">
                                                    <span className="font-bold text-brown-900 dark:text-white">{addr.full_name || user?.fullName}</span>
                                                    {selectedAddressId === addr.id && <FaCheckCircle className="text-vermilion" />}
                                                </div>
                                                <p className="text-sm text-brown-600 dark:text-gray-400 mt-1">
                                                    {addr.address_line1}, {addr.address_line2}
                                                </p>
                                                <p className="text-sm text-brown-600 dark:text-gray-400">
                                                    {addr.city}, {addr.state} - {addr.pincode}
                                                </p>
                                                <p className="text-sm text-brown-600 dark:text-gray-400 mt-2 flex items-center gap-1">
                                                    <span className="text-xs font-bold text-brown-400 dark:text-gray-500">Phone:</span> {addr.phone_number}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6 bg-cream-50 dark:bg-[#242424] rounded-lg border border-dashed border-brown-300 dark:border-gray-700">
                                        <p className="text-brown-500 dark:text-gray-400 mb-4">No addresses found</p>
                                        <button
                                            onClick={() => router.push('/profile?tab=addresses')}
                                            className="px-6 py-2 bg-vermilion text-white rounded-lg font-bold"
                                        >
                                            Add Address
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Payment Section */}
                            <div className="bg-white dark:bg-[#1A1A1A] p-6 rounded-xl shadow-sm dark:shadow-black/20 border border-cream-200 dark:border-gray-800">
                                <h2 className="text-xl font-bold text-brown-900 dark:text-white mb-4 flex items-center gap-2">
                                    <FaCreditCard className="text-vermilion" /> Payment Method
                                </h2>

                                <div className="space-y-3">
                                    <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-vermilion bg-vermilion/10' : 'border-cream-200 dark:border-gray-700 hover:border-brown-300 dark:hover:border-gray-600'}`}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="cod"
                                            checked={paymentMethod === 'cod'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-5 h-5 text-vermilion focus:ring-vermilion"
                                        />
                                        <div className="flex-1">
                                            <span className="font-bold text-brown-900 dark:text-white block">Cash on Delivery</span>
                                            <span className="text-sm text-brown-500 dark:text-gray-400">Pay when you receive the order</span>
                                        </div>
                                        <FaMoneyBillAlt className="text-2xl text-brown-400 dark:text-gray-500" />
                                    </label>

                                    <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'online' ? 'border-vermilion bg-vermilion/10' : 'border-cream-200 dark:border-gray-700 hover:border-brown-300 dark:hover:border-gray-600'}`}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="online"
                                            checked={paymentMethod === 'online'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-5 h-5 text-vermilion focus:ring-vermilion"
                                        />
                                        <div className="flex-1">
                                            <span className="font-bold text-brown-900 dark:text-white block">Online Payment</span>
                                            <span className="text-sm text-brown-500 dark:text-gray-400">UPI, Credit/Debit Card, Netbanking</span>
                                        </div>
                                        <FaCreditCard className="text-2xl text-brown-400 dark:text-gray-500" />
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-[#1A1A1A] p-6 rounded-xl shadow-sm dark:shadow-black/20 sticky top-24 border border-cream-200 dark:border-gray-800">
                                <h2 className="text-xl font-bold text-brown-900 dark:text-white mb-6">Order Summary</h2>

                                <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto custom-scrollbar">
                                    {cart.items.map((item: any) => (
                                        <div key={item.id} className="flex gap-4">
                                            <img src={item.images[0]} alt="" className="w-16 h-16 rounded-lg object-cover bg-cream-100 dark:bg-gray-800" />
                                            <div>
                                                <p className="font-medium text-brown-900 dark:text-white line-clamp-2 text-sm">{item.product_name}</p>
                                                <p className="text-xs text-brown-500 dark:text-gray-400">Size: {item.size} | Qty: {item.quantity}</p>
                                                <p className="font-bold text-brown-900 dark:text-white mt-1">₹{item.total}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-cream-200 dark:border-gray-700 pt-4 space-y-2 mb-6">
                                    <div className="flex justify-between text-brown-600 dark:text-gray-400">
                                        <span>Subtotal</span>
                                        <span>₹{cart.subtotal}</span>
                                    </div>
                                    <div className="flex justify-between text-brown-600 dark:text-gray-400">
                                        <span>Shipping</span>
                                        <span className="text-gold font-medium">Free</span>
                                    </div>
                                    <div className="flex justify-between text-brown-900 dark:text-white font-bold text-lg pt-2 border-t border-cream-100 dark:border-gray-700 mt-2">
                                        <span>Total Amount</span>
                                        <span>₹{cart.subtotal}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    disabled={processing || !selectedAddressId || cart.items.length === 0}
                                    className="w-full py-4 bg-vermilion text-white rounded-xl font-bold hover:bg-vermilion-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {processing ? 'Processing...' : paymentMethod === 'online' ? 'Proceed to Payment' : 'Place Order'}
                                </button>

                                <p className="text-xs text-center text-brown-400 dark:text-gray-500 mt-4">
                                    By placing an order, you agree to our Terms and Conditions.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
