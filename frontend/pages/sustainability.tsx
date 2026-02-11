import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { Leaf, Recycle, Heart, Globe, Droplets, Sun } from 'lucide-react';

const Sustainability = () => {
    const initiatives = [
        {
            icon: Leaf,
            title: 'Eco-Friendly Dyes',
            description: 'We use natural and low-impact dyes derived from plants, minerals, and organic sources. Our artisans follow traditional dyeing methods that minimize water pollution.',
            stat: '80%',
            statLabel: 'Natural dyes used'
        },
        {
            icon: Recycle,
            title: 'Zero-Waste Weaving',
            description: 'Every scrap of fabric finds a purpose. Our weavers create accessories, potlis, and decorative items from leftover materials, ensuring nothing goes to waste.',
            stat: '95%',
            statLabel: 'Material utilization'
        },
        {
            icon: Droplets,
            title: 'Water Conservation',
            description: 'Traditional handloom weaving uses significantly less water than industrial manufacturing. We partner with artisans who practice responsible water usage.',
            stat: '70%',
            statLabel: 'Less water vs. factories'
        },
        {
            icon: Sun,
            title: 'Solar-Powered Workshops',
            description: 'Many of our partner workshops are powered by solar energy, reducing our carbon footprint while supporting rural electrification.',
            stat: '12',
            statLabel: 'Solar-powered centers'
        },
        {
            icon: Heart,
            title: 'Fair Trade Practices',
            description: 'Every artisan receives fair wages, healthcare support, and skill development opportunities. We believe in prosperity that flows back to the communities.',
            stat: '500+',
            statLabel: 'Artisan families supported'
        },
        {
            icon: Globe,
            title: 'Carbon-Neutral Shipping',
            description: 'We offset our shipping emissions by investing in reforestation projects across India. Each order plants the seed for a greener future.',
            stat: '2000+',
            statLabel: 'Trees planted yearly'
        }
    ];

    return (
        <>
            <Head>
                <title>Sustainability | Hyderabad Clothing</title>
                <meta name="description" content="Discover our commitment to sustainable fashion, ethical practices, and preserving traditional craftsmanship for future generations." />
            </Head>

            <main className="min-h-screen bg-white dark:bg-gray-900">
                {/* Hero Section */}
                <section className="relative py-24 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2334d399' fill-opacity='0.3'%3E%3Cpath d='M40 40c0-11.046-8.954-20-20-20S0 28.954 0 40s8.954 20 20 20 20-8.954 20-20zm40 0c0-11.046-8.954-20-20-20S40 28.954 40 40s8.954 20 20 20 20-8.954 20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                        }} />
                    </div>
                    <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <Leaf size={40} className="text-white" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
                            Weaving a Sustainable Future
                        </h1>
                        <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
                            Fashion that honors tradition, respects nature, and empowers communities.
                        </p>
                    </div>
                </section>

                {/* Our Philosophy */}
                <section className="py-20 bg-emerald-50 dark:bg-gray-800">
                    <div className="container mx-auto px-4 md:px-8 max-w-4xl text-center">
                        <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-6">
                            Our Philosophy
                        </h2>
                        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                            At Hyderabad Clothing, sustainability isn't a marketing term—it's woven into our very fabric.
                            For centuries, Indian handloom has been inherently sustainable. Our artisans work with natural
                            fibers, traditional techniques, and time-honored methods that leave minimal environmental footprint.
                            We're not reinventing the wheel; we're preserving wisdom that's been sustainable for generations.
                        </p>
                        <div className="flex flex-wrap justify-center gap-8">
                            <div className="text-center">
                                <span className="block text-4xl font-bold text-emerald-600">100%</span>
                                <span className="text-gray-600 dark:text-gray-400">Handcrafted</span>
                            </div>
                            <div className="text-center">
                                <span className="block text-4xl font-bold text-emerald-600">Zero</span>
                                <span className="text-gray-600 dark:text-gray-400">Machine Production</span>
                            </div>
                            <div className="text-center">
                                <span className="block text-4xl font-bold text-emerald-600">500+</span>
                                <span className="text-gray-600 dark:text-gray-400">Artisan Partners</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Initiatives Grid */}
                <section className="py-20">
                    <div className="container mx-auto px-4 md:px-8">
                        <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white text-center mb-12">
                            Our Initiatives
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {initiatives.map((item, index) => (
                                <div
                                    key={index}
                                    className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow"
                                >
                                    <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mb-6">
                                        <item.icon size={28} className="text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                                        {item.description}
                                    </p>
                                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                                        <span className="text-3xl font-bold text-emerald-600">{item.stat}</span>
                                        <span className="block text-sm text-gray-500 dark:text-gray-400">{item.statLabel}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Commitment Banner */}
                <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600">
                    <div className="container mx-auto px-4 md:px-8 text-center">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
                            Our 2030 Commitment
                        </h2>
                        <p className="text-xl text-emerald-100 max-w-3xl mx-auto mb-8">
                            By 2030, we pledge to achieve 100% sustainable packaging, support 1000+ artisan families,
                            and plant 10,000 trees through our reforestation partners.
                        </p>
                        <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 rounded-full text-white">
                            <Leaf size={20} />
                            <span className="font-medium">Join us in making fashion sustainable</span>
                        </div>
                    </div>
                </section>

                {/* How You Can Help */}
                <section className="py-20 bg-gray-50 dark:bg-gray-800">
                    <div className="container mx-auto px-4 md:px-8 max-w-4xl">
                        <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white text-center mb-12">
                            How You Can Contribute
                        </h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-md">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Choose Quality Over Quantity</h3>
                                <p className="text-gray-600 dark:text-gray-300">One handwoven saree lasts generations. Invest in pieces that tell stories.</p>
                            </div>
                            <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-md">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Care for Your Garments</h3>
                                <p className="text-gray-600 dark:text-gray-300">Follow our care guides to extend the life of your handcrafted pieces.</p>
                            </div>
                            <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-md">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Pass It Forward</h3>
                                <p className="text-gray-600 dark:text-gray-300">Heritage pieces make beautiful heirlooms. Share the legacy.</p>
                            </div>
                            <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-md">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Spread the Word</h3>
                                <p className="text-gray-600 dark:text-gray-300">Support artisan communities by sharing their stories.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default Sustainability;
