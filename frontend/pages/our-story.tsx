// Our Story Page - About Hyderabad Clothing
// Brand story, values, and heritage

import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';

const OurStoryPage: React.FC = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    return (
        <Layout>
            <Head>
                <title>Our Story - Hyderabad Clothing</title>
                <meta name="description" content="Discover the heritage and passion behind Hyderabad Clothing - your destination for authentic Indian ethnic wear." />
            </Head>

            {/* Hero Section */}
            <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-vermilion via-red-800 to-brown-900">
                    <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/6311545/pexels-photo-6311545.jpeg')] bg-cover bg-center opacity-20" />
                </div>
                <div className="relative z-10 text-center text-white px-4">
                    <motion.h1
                        {...fadeIn}
                        className="text-4xl md:text-6xl font-bold mb-4"
                    >
                        Our Story
                    </motion.h1>
                    <motion.p
                        {...fadeIn}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto"
                    >
                        Weaving traditions into every thread since 2018
                    </motion.p>
                </div>
            </section>

            {/* Origin Story */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="text-vermilion font-semibold uppercase tracking-wider text-sm">Where It All Began</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-6">
                                From Hyderabad's Heart to Your Wardrobe
                            </h2>
                            <div className="space-y-4 text-gray-600 leading-relaxed">
                                <p>
                                    In the bustling lanes of Hyderabad's historic textile markets, where the aroma of zardozi
                                    and silk fills the air, our journey began. What started as a small family endeavor has
                                    blossomed into a celebration of India's rich textile heritage.
                                </p>
                                <p>
                                    Founded in 2018, Hyderabad Clothing was born from a simple yet profound vision: to bring
                                    the exquisite craftsmanship of Indian artisans to discerning fashion enthusiasts worldwide,
                                    while preserving the authenticity that makes each piece unique.
                                </p>
                                <p>
                                    Our founders, having grown up surrounded by the vibrant textile traditions of Telangana,
                                    understood the irreplaceable value of handcrafted ethnic wear. They dreamed of creating
                                    a platform where the timeless beauty of Indian textiles could meet modern sensibilities.
                                </p>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="relative"
                        >
                            <div className="aspect-[4/5] relative rounded-2xl overflow-hidden shadow-2xl">
                                <Image
                                    src="https://images.pexels.com/photos/6311577/pexels-photo-6311577.jpeg"
                                    alt="Traditional Indian textiles"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-accent-gold rounded-2xl flex items-center justify-center text-white shadow-xl">
                                <div className="text-center">
                                    <div className="text-3xl font-bold">6+</div>
                                    <div className="text-sm">Years of Trust</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 bg-cream-50">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="text-vermilion font-semibold uppercase tracking-wider text-sm">What We Stand For</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                            Our Core Values
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: '🎨',
                                title: 'Authentic Craftsmanship',
                                description: 'Every piece in our collection is sourced from skilled artisans who have inherited their craft through generations. We celebrate and preserve these traditional techniques.'
                            },
                            {
                                icon: '♻️',
                                title: 'Sustainable Fashion',
                                description: 'We believe in fashion that doesn\'t cost the earth. Our commitment to sustainable practices means eco-friendly packaging and supporting fair trade initiatives.'
                            },
                            {
                                icon: '🤝',
                                title: 'Empowering Communities',
                                description: 'By partnering directly with weaver communities across India, we ensure fair wages and sustainable livelihoods while bringing you authentic products.'
                            },
                            {
                                icon: '✨',
                                title: 'Quality Assurance',
                                description: 'Each product undergoes rigorous quality checks. We guarantee the authenticity of materials and craftsmanship that you can trust.'
                            },
                            {
                                icon: '💎',
                                title: 'Heritage Preservation',
                                description: 'We\'re dedicated to preserving India\'s textile heritage by documenting and promoting traditional weaving techniques that are at risk of being forgotten.'
                            },
                            {
                                icon: '🌍',
                                title: 'Global Accessibility',
                                description: 'Making Indian ethnic wear accessible worldwide, we bridge the gap between traditional artisans and global customers seeking authentic pieces.'
                            }
                        ].map((value, index) => (
                            <motion.div
                                key={value.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
                            >
                                <div className="text-4xl mb-4">{value.icon}</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                                <p className="text-gray-600">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Numbers Section */}
            <section className="py-20 bg-gradient-to-r from-vermilion to-red-700 text-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { number: '10,000+', label: 'Happy Customers' },
                            { number: '500+', label: 'Artisan Partners' },
                            { number: '15+', label: 'States Covered' },
                            { number: '28', label: 'Product Categories' }
                        ].map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="text-4xl md:text-5xl font-bold text-accent-gold mb-2">{stat.number}</div>
                                <div className="text-white/80">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Artisan Story */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="order-2 md:order-1"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div className="aspect-square relative rounded-xl overflow-hidden">
                                    <Image
                                        src="https://images.pexels.com/photos/6311570/pexels-photo-6311570.jpeg"
                                        alt="Artisan at work"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="aspect-square relative rounded-xl overflow-hidden mt-8">
                                    <Image
                                        src="https://images.pexels.com/photos/6311504/pexels-photo-6311504.jpeg"
                                        alt="Traditional weaving"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="aspect-square relative rounded-xl overflow-hidden">
                                    <Image
                                        src="https://images.pexels.com/photos/6311579/pexels-photo-6311579.jpeg"
                                        alt="Fabric details"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="aspect-square relative rounded-xl overflow-hidden mt-8">
                                    <Image
                                        src="https://images.pexels.com/photos/7697311/pexels-photo-7697311.jpeg"
                                        alt="Finished products"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="order-1 md:order-2"
                        >
                            <span className="text-vermilion font-semibold uppercase tracking-wider text-sm">Our Artisans</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-6">
                                The Hands Behind the Magic
                            </h2>
                            <div className="space-y-4 text-gray-600 leading-relaxed">
                                <p>
                                    Behind every saree, kurta, and lehenga in our collection are skilled artisans whose
                                    families have been practicing these crafts for generations. From the intricate Banarasi
                                    weavers of Varanasi to the Kalamkari artists of Andhra Pradesh, we work directly with
                                    over 500 artisan families.
                                </p>
                                <p>
                                    We believe in fair trade and ensure that our artisan partners receive fair compensation
                                    for their extraordinary skills. By choosing Hyderabad Clothing, you're not just buying
                                    a garment—you're supporting an entire ecosystem of traditional craftsmanship.
                                </p>
                                <p>
                                    Each piece tells a story of dedication, patience, and artistic excellence. Whether it's
                                    the six months of work that goes into a Kanjeevaram silk saree or the delicate hand
                                    embroidery on a festive kurta, we ensure these stories reach you with every purchase.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-cream-50">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Be Part of Our Journey
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                            Join thousands of customers who have made Hyderabad Clothing their trusted destination
                            for authentic Indian ethnic wear. Experience the magic of traditional craftsmanship.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/collections"
                                className="bg-vermilion text-white px-8 py-3 rounded-xl font-semibold hover:bg-vermilion-600 transition-colors"
                            >
                                Explore Collections
                            </Link>
                            <Link
                                href="/collections?sort=new-arrivals"
                                className="border-2 border-vermilion text-vermilion px-8 py-3 rounded-xl font-semibold hover:bg-vermilion hover:text-white transition-colors"
                            >
                                New Arrivals
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </Layout>
    );
};

export default OurStoryPage;
