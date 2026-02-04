import React from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Eye, Keyboard, MousePointer, Monitor, Volume2, MessageCircle } from 'lucide-react';
import Layout from '../components/Layout';

export default function Accessibility() {
    const features = [
        {
            icon: <Eye className="w-6 h-6 text-vermilion" />,
            title: "Visual Accessibility",
            items: [
                "High contrast color schemes for better readability",
                "Scalable text that adjusts to browser zoom settings",
                "Alt text descriptions for all product images",
                "Clear visual hierarchy and consistent layouts"
            ]
        },
        {
            icon: <Keyboard className="w-6 h-6 text-vermilion" />,
            title: "Keyboard Navigation",
            items: [
                "Full keyboard navigation support throughout the site",
                "Visible focus indicators for interactive elements",
                "Skip navigation links to bypass repetitive content",
                "Logical tab order for all page elements"
            ]
        },
        {
            icon: <MousePointer className="w-6 h-6 text-vermilion" />,
            title: "Motor Accessibility",
            items: [
                "Large clickable areas for buttons and links",
                "No time-limited interactions",
                "Touch-friendly interface for mobile users",
                "Minimal reliance on precise mouse movements"
            ]
        },
        {
            icon: <Monitor className="w-6 h-6 text-vermilion" />,
            title: "Screen Reader Support",
            items: [
                "ARIA labels and landmarks for navigation",
                "Semantic HTML structure for proper content reading",
                "Form labels and error messages announced clearly",
                "Dynamic content updates announced appropriately"
            ]
        },
        {
            icon: <Volume2 className="w-6 h-6 text-vermilion" />,
            title: "Audio & Video",
            items: [
                "No auto-playing audio or video content",
                "Captions available for video content when applicable",
                "Visual alternatives for audio-only information",
                "Volume controls for any media content"
            ]
        },
        {
            icon: <MessageCircle className="w-6 h-6 text-vermilion" />,
            title: "Communication",
            items: [
                "Multiple contact methods available",
                "Clear and simple language throughout",
                "Error messages with helpful guidance",
                "Customer support trained in accessibility needs"
            ]
        }
    ];

    return (
        <Layout>
            <Head>
                <title>Accessibility | Hyderabad Clothing</title>
                <meta name="description" content="Our commitment to digital accessibility - making Hyderabad Clothing accessible to everyone." />
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
                            Accessibility
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-lg text-brown-600 leading-relaxed"
                        >
                            We believe everyone deserves equal access to fashion. Our commitment to accessibility ensures that all customers can browse, shop, and enjoy our products regardless of their abilities.
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* Commitment Statement */}
            <section className="py-12 bg-white border-b border-cream-200">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-brown-900 text-cream-50 p-8 md:p-12 rounded-2xl"
                        >
                            <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Commitment</h2>
                            <p className="text-cream-200 leading-relaxed text-lg">
                                Hyderabad Clothing is committed to ensuring digital accessibility for people with disabilities. We continually work to improve the user experience for everyone and apply relevant accessibility standards. Our goal is to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Accessibility Features */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-bold text-brown-900 mb-8 text-center">
                            Accessibility Features
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    viewport={{ once: true }}
                                    className="p-6 rounded-2xl bg-cream-50 border border-cream-200"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-sm">
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-lg font-bold text-brown-900">
                                            {feature.title}
                                        </h3>
                                    </div>
                                    <ul className="space-y-2">
                                        {feature.items.map((item, itemIndex) => (
                                            <li key={itemIndex} className="text-brown-600 flex items-start gap-2">
                                                <span className="text-accent-gold mt-1">•</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Feedback Section */}
            <section className="py-16 bg-cream-50">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-3xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-2xl md:text-3xl font-bold text-brown-900 mb-4">
                                Feedback Welcome
                            </h2>
                            <p className="text-brown-600 mb-6 leading-relaxed">
                                We welcome your feedback on the accessibility of Hyderabad Clothing. If you encounter any accessibility barriers or have suggestions for improvement, please let us know.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a
                                    href="/contact"
                                    className="inline-block bg-brown-900 text-cream-50 px-8 py-3 rounded-full font-semibold hover:bg-brown-800 transition-colors"
                                >
                                    Contact Us
                                </a>
                                <a
                                    href="mailto:accessibility@hyderabadclothing.com"
                                    className="inline-block bg-white text-brown-900 px-8 py-3 rounded-full font-semibold border-2 border-brown-900 hover:bg-cream-100 transition-colors"
                                >
                                    Email Accessibility Team
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Third-Party Content */}
            <section className="py-12 bg-white">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-xl font-bold text-brown-900 mb-4">Third-Party Content</h2>
                        <p className="text-brown-600 leading-relaxed">
                            While we strive to ensure accessibility across our entire platform, some third-party content or functionality may not be fully accessible. We work with our partners to encourage them to provide accessible content and will seek to find alternative solutions where possible.
                        </p>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
