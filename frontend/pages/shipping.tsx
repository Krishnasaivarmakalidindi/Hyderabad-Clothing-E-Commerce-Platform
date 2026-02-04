import React from 'react';
import Head from 'next/head';
import { Truck, Globe, Clock, AlertCircle } from 'lucide-react';
import Layout from '../components/Layout';

export default function Shipping() {
    return (
        <Layout>
            <Head>
                <title>Shipping Policy | Hyderabad Clothing</title>
                <meta name="description" content="Shipping and delivery information for Hyderabad Clothing." />
            </Head>

            <div className="bg-cream-50 min-h-screen py-12">
                <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                    <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
                        <div className="text-center mb-12">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Truck size={32} />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black text-brown-900 mb-4">Shipping Policy</h1>
                            <p className="text-brown-600 max-w-2xl mx-auto">
                                Fast, reliable delivery to your doorstep.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 mb-12">
                            <div className="p-6 border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                                <Clock className="w-10 h-10 text-vermilion mb-4" />
                                <h3 className="text-lg font-bold text-brown-900 mb-2">Domestic Shipping</h3>
                                <p className="text-brown-600 text-sm">
                                    We offer free shipping on all orders above ₹999 within India. Standard delivery takes 3-5 business days depending on the location.
                                </p>
                            </div>
                            <div className="p-6 border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                                <Globe className="w-10 h-10 text-vermilion mb-4" />
                                <h3 className="text-lg font-bold text-brown-900 mb-2">International Shipping</h3>
                                <p className="text-brown-600 text-sm">
                                    We ship globally! International shipping charges are calculated at checkout based on weight and destination. Delivery typically takes 7-14 business days.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <section>
                                <h3 className="text-xl font-bold text-brown-900 mb-3">Order Processing</h3>
                                <p className="text-brown-600 leading-relaxed">
                                    All orders are processed within 24 hours of confirmation. You will receive a tracking link via email and SMS once your order is dispatched.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-bold text-brown-900 mb-3">Delays & Issues</h3>
                                <div className="flex gap-4 bg-amber-50 p-4 rounded-lg border border-amber-100">
                                    <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
                                    <p className="text-sm text-brown-700">
                                        While we strive for timely delivery, unforeseen circumstances like weather or courier delays may affect delivery times. Please contact support if your order is delayed beyond 7 days.
                                    </p>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
