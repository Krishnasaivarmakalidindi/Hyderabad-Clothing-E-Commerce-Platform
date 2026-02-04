import React from 'react';
import Link from 'next/link';
import { FaCheckCircle, FaShoppingBag, FaArrowRight } from 'react-icons/fa';
import Layout from '../components/Layout';

export default function OrderSuccess() {
    return (
        <Layout title="Order Successful - Hyderabad Clothing">
            <div className="min-h-screen flex items-center justify-center bg-cream-50 dark:bg-[#121212] py-12 px-4">
                <div className="max-w-md w-full bg-white dark:bg-[#1A1A1A] p-10 rounded-2xl shadow-xl dark:shadow-black/30 border border-cream-200 dark:border-gray-800 text-center">
                    <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaCheckCircle className="text-gold text-4xl animate-bounce" />
                    </div>

                    <h1 className="text-3xl font-black text-brown-900 dark:text-white mb-2">Order Confirmed!</h1>
                    <p className="text-brown-600 dark:text-gray-300 mb-8">
                        Thank you for your purchase. Your order has been placed successfully and will be delivered soon.
                    </p>

                    <div className="space-y-4">
                        <Link href="/profile?tab=orders" className="block w-full py-4 bg-vermilion text-white rounded-xl font-bold hover:bg-vermilion-600 transition-all shadow-lg">
                            Track Your Order
                        </Link>

                        <Link href="/" className="block w-full py-4 bg-white dark:bg-[#242424] text-brown-900 dark:text-white rounded-xl font-bold border border-cream-200 dark:border-gray-700 hover:bg-cream-50 dark:hover:bg-gray-800 transition-all">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
