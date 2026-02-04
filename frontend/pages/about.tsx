import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Users, Heart, Award } from 'lucide-react';
import Layout from '../components/Layout';

export default function About() {
    return (
        <Layout>
            <Head>
                <title>Our Story | Hyderabad Clothing</title>
                <meta name="description" content="The story behind Hyderabad Clothing - bridging tradition with modern fashion." />
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
                            Our Story
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-lg text-brown-600 leading-relaxed"
                        >
                            Born from the vibrant streets of Hyderabad, we are a passionate team dedicated to bringing the timeless elegance of Indian ethnic wear to the world. What started as a small local boutique has grown into a platform that celebrates craftsmanship, culture, and authentic style.
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Award className="w-8 h-8 text-vermilion" />,
                                title: "Authentic Quality",
                                desc: "Every piece is handpicked directly from artisans and weavers to ensure genuine quality and craftsmanship."
                            },
                            {
                                icon: <Heart className="w-8 h-8 text-vermilion" />,
                                title: "Customer First",
                                desc: "We believe in building relationships, not just customers. Your satisfaction is our highest priority."
                            },
                            {
                                icon: <Users className="w-8 h-8 text-vermilion" />,
                                title: "Community Driven",
                                desc: "We support local artisans and communities, ensuring fair trade and sustainable practices."
                            }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-8 rounded-2xl bg-cream-50 hover:shadow-lg transition-all border border-cream-200"
                            >
                                <div className="mb-4 bg-white w-16 h-16 rounded-full flex items-center justify-center shadow-sm">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold text-brown-900 mb-3">{item.title}</h3>
                                <p className="text-brown-600">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Visit Us Section (Mock) */}
            <section className="py-16 md:py-24 bg-brown-900 text-cream-50 relative overflow-hidden">
                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="md:w-1/2">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Visit Our Store</h2>
                            <p className="text-cream-200 text-lg mb-8 leading-relaxed">
                                Experience the fabrics and designs in person. Our flagship store in Banjara Hills offers a personalized shopping experience with our expert stylists.
                            </p>
                            <div className="flex items-start gap-4 mb-4">
                                <MapPin className="w-6 h-6 text-accent-gold mt-1" />
                                <div>
                                    <h4 className="font-bold text-xl mb-1">Hyderabad Clothing</h4>
                                    <p className="text-cream-200">Road No. 12, Banjara Hills<br />Hyderabad, Telangana 500034</p>
                                </div>
                            </div>
                        </div>
                        <div className="md:w-1/2 h-80 bg-brown-800 rounded-2xl flex items-center justify-center border-2 border-brown-700">
                            <span className="text-brown-500 font-medium flex flex-col items-center">
                                <MapPin size={48} className="mb-2 opacity-50" />
                                Map Placeholder
                            </span>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
