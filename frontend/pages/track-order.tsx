import React, { useState } from 'react';
import Head from 'next/head';
import { Package, Search, ArrowRight, Truck, CheckCircle } from 'lucide-react';
import Layout from '../components/Layout';

export default function TrackOrder() {
    const [orderId, setOrderId] = useState('');
    const [contact, setContact] = useState('');
    const [status, setStatus] = useState<'idle' | 'searching' | 'found' | 'error'>('idle');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('searching');
        // Simulate API call
        setTimeout(() => {
            if (orderId.length > 3) {
                setStatus('found');
            } else {
                setStatus('error');
            }
        }, 1500);
    };

    return (
        <Layout>
            <Head>
                <title>Track Order | Hyderabad Clothing</title>
                <meta name="description" content="Track your order status securely." />
            </Head>

            <div className="bg-cream-50 min-h-screen py-16">
                <div className="container mx-auto px-4 md:px-6 max-w-2xl">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-black text-brown-900 mb-4">Track Your Order</h1>
                        <p className="text-brown-600">Enter your Order ID (sent via email/SMS) to check status.</p>
                    </div>

                    <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-cream-200">
                        <form onSubmit={handleSearch} className="space-y-6">
                            <div>
                                <label htmlFor="orderId" className="block text-sm font-medium text-brown-700 mb-1">Order ID</label>
                                <div className="relative">
                                    <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-brown-400" size={20} />
                                    <input
                                        type="text"
                                        id="orderId"
                                        placeholder="e.g. HYD-123456"
                                        className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-vermilion focus:border-transparent outline-none transition-all uppercase"
                                        value={orderId}
                                        onChange={(e) => setOrderId(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="contact" className="block text-sm font-medium text-brown-700 mb-1">Email or Phone Number</label>
                                <input
                                    type="text"
                                    id="contact"
                                    placeholder="Enter email or phone used for order"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-vermilion focus:border-transparent outline-none transition-all"
                                    value={contact}
                                    onChange={(e) => setContact(e.target.value)}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={status === 'searching'}
                                className="w-full bg-vermilion text-white font-bold py-3 rounded-lg hover:bg-vermilion-600 transition-colors shadow-lg shadow-red-200 disabled:opacity-70 flex items-center justify-center gap-2"
                            >
                                {status === 'searching' ? (
                                    <>Searching...</>
                                ) : (
                                    <>Track Order <ArrowRight size={18} /></>
                                )}
                            </button>
                        </form>

                        {status === 'error' && (
                            <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm text-center">
                                Order not found. Please check your Order ID and try again.
                            </div>
                        )}
                    </div>

                    {status === 'found' && (
                        <div className="mt-8 bg-white p-8 rounded-2xl shadow-sm border border-cream-200 animate-fade-in-up">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                                <div>
                                    <h3 className="font-bold text-brown-900 text-lg">Order #{orderId.toUpperCase()}</h3>
                                    <p className="text-sm text-brown-500">Placed on Oct 24, 2024</p>
                                </div>
                                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                    In Transit
                                </span>
                            </div>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white z-10">
                                            <CheckCircle size={16} />
                                        </div>
                                        <div className="w-0.5 h-12 bg-green-500"></div>
                                    </div>
                                    <div className="pb-8">
                                        <h4 className="font-bold text-brown-900">Order Confirmed</h4>
                                        <p className="text-xs text-brown-500">Oct 24, 10:30 AM</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white z-10">
                                            <Package size={16} />
                                        </div>
                                        <div className="w-0.5 h-12 bg-green-500"></div>
                                    </div>
                                    <div className="pb-8">
                                        <h4 className="font-bold text-brown-900">Packed</h4>
                                        <p className="text-xs text-brown-500">Oct 24, 02:45 PM</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white z-10 shadow-lg shadow-blue-200">
                                            <Truck size={16} />
                                        </div>
                                    </div>
                                    <div className="pb-0">
                                        <h4 className="font-bold text-brown-900">Shipped</h4>
                                        <p className="text-sm text-brown-600">Your item is on the way to the delivery hub.</p>
                                        <p className="text-xs text-brown-500 mt-1">Expected: Oct 27, 2024</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
