import React from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import { FaHeart, FaShoppingBag, FaTrash } from 'react-icons/fa';

export default function Wishlist() {
    // Mock wishlist data for visual purposes or empty state
    const wishlistItems = [
        // { id: 1, name: 'Kanjeevaram Silk Saree', price: 12999, image: '...', inStock: true }
    ];

    return (
        <Layout title="My Wishlist - Hyderabad Clothing">
            <div className="bg-cream-50 dark:bg-[#121212] min-h-screen py-10">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold text-brown-900 dark:text-white mb-8 flex items-center gap-3">
                        <FaHeart className="text-vermilion" /> My Wishlist
                    </h1>

                    {wishlistItems.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Render items here if we had them */}
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-[#1A1A1A] rounded-xl shadow-sm dark:shadow-black/20 p-12 text-center border border-cream-200 dark:border-gray-800">
                            <div className="w-20 h-20 bg-vermilion/10 text-vermilion rounded-full flex items-center justify-center mx-auto mb-6">
                                <FaHeart size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-brown-900 dark:text-white mb-2">Your wishlist is empty</h2>
                            <p className="text-brown-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                                Save items you love here to buy them later. Explore our collections to find your favorites.
                            </p>
                            <Link
                                href="/collections?sort=new-arrivals"
                                className="inline-block bg-vermilion text-white font-bold py-3 px-8 rounded-full hover:bg-vermilion-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                Start Shopping
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
