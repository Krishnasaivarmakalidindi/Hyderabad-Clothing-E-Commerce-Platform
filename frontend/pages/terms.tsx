import React from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { FileText, Shield, CreditCard, Truck, RotateCcw, Scale } from 'lucide-react';
import Layout from '../components/Layout';

export default function Terms() {
    const sections = [
        {
            icon: <FileText className="w-6 h-6 text-vermilion" />,
            title: "1. Acceptance of Terms",
            content: `By accessing and using the Hyderabad Clothing website and services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.

These terms apply to all visitors, users, and customers of our platform. We reserve the right to modify these terms at any time, and your continued use of the service constitutes acceptance of any changes.`
        },
        {
            icon: <Shield className="w-6 h-6 text-vermilion" />,
            title: "2. Privacy & Data Protection",
            content: `We are committed to protecting your personal information. All data collected through our platform is handled in accordance with applicable data protection laws.

We collect personal information such as name, email, phone number, and shipping address solely for order processing and communication purposes. Your payment information is processed securely through our payment partners and is never stored on our servers.

We do not sell or share your personal information with third parties for marketing purposes without your explicit consent.`
        },
        {
            icon: <CreditCard className="w-6 h-6 text-vermilion" />,
            title: "3. Pricing & Payments",
            content: `All prices displayed on our website are in Indian Rupees (INR) and include applicable taxes unless otherwise stated.

We accept various payment methods including credit/debit cards, UPI, net banking, and cash on delivery for eligible orders. Prices are subject to change without prior notice, but orders placed before any price change will be honored at the original price.

In case of payment failure or fraud detection, we reserve the right to cancel orders and refund any amounts paid.`
        },
        {
            icon: <Truck className="w-6 h-6 text-vermilion" />,
            title: "4. Shipping & Delivery",
            content: `We strive to deliver all orders within the estimated timeframe, typically 5-7 business days for standard delivery within India. Express delivery options are available for select locations.

Shipping charges are calculated based on delivery location and order value. Free shipping is available on orders above ₹1,999.

Risk of loss and title for items pass to you upon delivery. We are not responsible for delays caused by carrier issues, weather conditions, or circumstances beyond our control.`
        },
        {
            icon: <RotateCcw className="w-6 h-6 text-vermilion" />,
            title: "5. Returns & Refunds",
            content: `We accept returns within 7 days of delivery for most products, provided they are unused, unwashed, and in original condition with all tags attached.

Custom-made or personalized items, innerwear, and sale items are non-returnable unless defective.

Refunds will be processed within 7-10 business days after we receive and verify the returned item. The refund will be credited to the original payment method.`
        },
        {
            icon: <Scale className="w-6 h-6 text-vermilion" />,
            title: "6. Intellectual Property",
            content: `All content on this website, including text, graphics, logos, images, and software, is the property of Hyderabad Clothing and is protected by intellectual property laws.

You may not reproduce, distribute, modify, or create derivative works from any content without our prior written permission.

Product images are for representation purposes only. Actual products may vary slightly in color, design, or specifications due to photographic and screen display limitations.`
        }
    ];

    return (
        <Layout>
            <Head>
                <title>Terms of Service | Hyderabad Clothing</title>
                <meta name="description" content="Terms of Service for Hyderabad Clothing - Read our policies on orders, payments, shipping, and returns." />
            </Head>

            {/* Hero Section */}
            <section className="bg-cream-50 py-16 md:py-24">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-3xl mx-auto text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-black text-brown-900 mb-6"
                        >
                            Terms of Service
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-lg text-brown-600 leading-relaxed"
                        >
                            Please read these terms carefully before using our services. By using Hyderabad Clothing, you agree to these terms and conditions.
                        </motion.p>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-sm text-brown-500 mt-4"
                        >
                            Last updated: February 2026
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* Terms Content */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-4xl mx-auto space-y-8">
                        {sections.map((section, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                viewport={{ once: true }}
                                className="p-6 md:p-8 rounded-2xl bg-cream-50 border border-cream-200"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center shadow-sm">
                                        {section.icon}
                                    </div>
                                    <h2 className="text-xl md:text-2xl font-bold text-brown-900">
                                        {section.title}
                                    </h2>
                                </div>
                                <div className="text-brown-600 leading-relaxed whitespace-pre-line pl-0 md:pl-16">
                                    {section.content}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 bg-brown-900 text-cream-50">
                <div className="container mx-auto px-4 md:px-6 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">Have Questions?</h2>
                    <p className="text-cream-200 mb-6 max-w-2xl mx-auto">
                        If you have any questions about our Terms of Service, please contact our customer support team.
                    </p>
                    <a
                        href="/contact"
                        className="inline-block bg-accent-gold text-brown-900 px-8 py-3 rounded-full font-semibold hover:bg-accent-gold/90 transition-colors"
                    >
                        Contact Us
                    </a>
                </div>
            </section>
        </Layout>
    );
}
