import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Shield, Lock, Eye, Database, Mail, UserCheck } from 'lucide-react';

const PrivacyPolicy = () => {
    const sections = [
        {
            icon: Database,
            title: 'Information We Collect',
            content: [
                'Personal details (name, email, phone number, shipping address) when you create an account or place an order',
                'Payment information processed securely through our payment partners',
                'Browsing data and preferences to improve your shopping experience',
                'Communication preferences and order history'
            ]
        },
        {
            icon: Eye,
            title: 'How We Use Your Information',
            content: [
                'Process and fulfill your orders with care and precision',
                'Send order confirmations, shipping updates, and delivery notifications',
                'Personalize your shopping experience with relevant recommendations',
                'Improve our products, services, and website functionality',
                'Send promotional offers (only with your consent)'
            ]
        },
        {
            icon: Shield,
            title: 'How We Protect Your Data',
            content: [
                '256-bit SSL encryption for all data transmission',
                'PCI-DSS compliant payment processing',
                'Regular security audits and vulnerability assessments',
                'Strict access controls and employee training',
                'Secure data centers with 24/7 monitoring'
            ]
        },
        {
            icon: UserCheck,
            title: 'Your Rights',
            content: [
                'Access your personal data at any time through your account',
                'Request correction of inaccurate information',
                'Delete your account and associated data',
                'Opt-out of marketing communications',
                'Data portability upon request'
            ]
        },
        {
            icon: Lock,
            title: 'Cookies & Tracking',
            content: [
                'Essential cookies for website functionality and security',
                'Analytics cookies to understand how visitors use our site',
                'Preference cookies to remember your settings',
                'You can manage cookie preferences in your browser settings'
            ]
        }
    ];

    return (
        <>
            <Head>
                <title>Privacy Policy | Hyderabad Clothing</title>
                <meta name="description" content="Learn how Hyderabad Clothing protects your privacy and handles your personal information with care." />
            </Head>

            <main className="min-h-screen bg-white dark:bg-gray-900">
                {/* Hero Section */}
                <section className="relative py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23B59410' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                        }} />
                    </div>
                    <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/20">
                            <Shield size={40} className="text-gray-900" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
                            Privacy Policy
                        </h1>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            Your trust is precious to us. Learn how we protect your personal information.
                        </p>
                        <p className="text-gray-400 mt-4">Last updated: January 2026</p>
                    </div>
                </section>

                {/* Introduction */}
                <section className="py-16 bg-amber-50 dark:bg-gray-800">
                    <div className="container mx-auto px-4 md:px-8 max-w-4xl">
                        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                            At Hyderabad Clothing, we are committed to protecting your privacy and ensuring the security
                            of your personal information. This Privacy Policy explains how we collect, use, and safeguard
                            your data when you visit our website or make a purchase. By using our services, you agree to
                            the practices described in this policy.
                        </p>
                    </div>
                </section>

                {/* Policy Sections */}
                <section className="py-20">
                    <div className="container mx-auto px-4 md:px-8 max-w-4xl">
                        <div className="space-y-12">
                            {sections.map((section, index) => (
                                <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <section.icon size={24} className="text-amber-600 dark:text-amber-400" />
                                        </div>
                                        <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">
                                            {section.title}
                                        </h2>
                                    </div>
                                    <ul className="space-y-3 ml-16">
                                        {section.content.map((item, i) => (
                                            <li key={i} className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                                                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        {/* Third-Party Services */}
                        <div className="mt-12 bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
                            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-4">
                                Third-Party Services
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                We work with trusted partners to provide you with the best experience:
                            </p>
                            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                                    Payment processors (Razorpay, PayPal) for secure transactions
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                                    Shipping partners (Delhivery, BlueDart) for order delivery
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                                    Analytics tools to improve our services
                                </li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div className="mt-12 text-center bg-gradient-to-r from-amber-50 to-amber-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8">
                            <Mail size={40} className="text-amber-600 mx-auto mb-4" />
                            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-2">
                                Questions About Privacy?
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                We're here to help. Contact our privacy team for any concerns.
                            </p>
                            <a
                                href="mailto:privacy@hyderabadclothing.com"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-gray-900 font-semibold rounded-xl hover:bg-amber-600 transition-colors"
                            >
                                <Mail size={18} />
                                privacy@hyderabadclothing.com
                            </a>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default PrivacyPolicy;
