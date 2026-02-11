import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { Heart, MapPin, Award, Users, Sparkles } from 'lucide-react';

const Artisans = () => {
    const artisanStories = [
        {
            name: 'Lakshmi Devi',
            craft: 'Pochampally Ikat Weaving',
            location: 'Pochampally, Telangana',
            experience: '35 years',
            story: 'A master weaver who learned the art from her grandmother. Her intricate geometric patterns have won national recognition. She now trains young weavers to keep this 500-year-old tradition alive.',
            image: '/images/artisans/lakshmi.jpg'
        },
        {
            name: 'Mohammed Ismail',
            craft: 'Himroo Weaving',
            location: 'Aurangabad, Maharashtra',
            experience: '28 years',
            story: 'Third-generation Himroo weaver specializing in silk and cotton blends. His family has preserved Mughal-era designs that once adorned the courts of Hyderabad.',
            image: '/images/artisans/ismail.jpg'
        },
        {
            name: 'Padma Rani',
            craft: 'Gadwal Saree Weaving',
            location: 'Gadwal, Telangana',
            experience: '22 years',
            story: 'Known for her exceptional zari work, Padma creates sarees that take up to 15 days to complete. Each piece is a labor of love and precision.',
            image: '/images/artisans/padma.jpg'
        },
        {
            name: 'Raju Kumar',
            craft: 'Kalamkari Art',
            location: 'Srikalahasti, Andhra Pradesh',
            experience: '40 years',
            story: 'A living legend in Kalamkari art, Raju uses natural dyes and traditional pen techniques to create mythological narratives on fabric.',
            image: '/images/artisans/raju.jpg'
        },
    ];

    const crafts = [
        {
            name: 'Pochampally Ikat',
            description: 'Tie-dye weaving technique creating geometric patterns',
            artisans: 120
        },
        {
            name: 'Gadwal Sarees',
            description: 'Cotton-silk blend with distinctive pallu and borders',
            artisans: 85
        },
        {
            name: 'Himroo Weaving',
            description: 'Mughal-inspired brocade with metallic threads',
            artisans: 45
        },
        {
            name: 'Kalamkari',
            description: 'Hand-painted or block-printed narrative art on fabric',
            artisans: 60
        },
        {
            name: 'Venkatagiri Sarees',
            description: 'Fine cotton sarees with delicate zari borders',
            artisans: 70
        },
        {
            name: 'Narayanpet Sarees',
            description: 'Traditional cotton sarees with temple borders',
            artisans: 55
        },
    ];

    return (
        <>
            <Head>
                <title>Our Artisans | Hyderabad Clothing</title>
                <meta name="description" content="Meet the master artisans behind Hyderabad Clothing. Discover their stories, crafts, and the heritage they preserve." />
            </Head>

            <main className="min-h-screen bg-white dark:bg-gray-900">
                {/* Hero Section */}
                <section className="relative py-24 bg-gradient-to-br from-amber-900 via-amber-800 to-orange-900 overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fbbf24' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                        }} />
                    </div>
                    <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <Heart size={40} className="text-gray-900" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
                            Our Artisans
                        </h1>
                        <p className="text-xl text-amber-100 max-w-2xl mx-auto">
                            The hands that weave dreams into fabric. Meet the guardians of India's textile heritage.
                        </p>
                    </div>
                </section>

                {/* Stats */}
                <section className="py-12 bg-amber-50 dark:bg-gray-800">
                    <div className="container mx-auto px-4 md:px-8">
                        <div className="flex flex-wrap justify-center gap-12">
                            <div className="text-center">
                                <Users size={32} className="text-amber-600 mx-auto mb-2" />
                                <span className="block text-4xl font-bold text-gray-900 dark:text-white">500+</span>
                                <span className="text-gray-600 dark:text-gray-400">Artisan Families</span>
                            </div>
                            <div className="text-center">
                                <MapPin size={32} className="text-amber-600 mx-auto mb-2" />
                                <span className="block text-4xl font-bold text-gray-900 dark:text-white">25+</span>
                                <span className="text-gray-600 dark:text-gray-400">Villages</span>
                            </div>
                            <div className="text-center">
                                <Award size={32} className="text-amber-600 mx-auto mb-2" />
                                <span className="block text-4xl font-bold text-gray-900 dark:text-white">12</span>
                                <span className="text-gray-600 dark:text-gray-400">National Awardees</span>
                            </div>
                            <div className="text-center">
                                <Sparkles size={32} className="text-amber-600 mx-auto mb-2" />
                                <span className="block text-4xl font-bold text-gray-900 dark:text-white">6</span>
                                <span className="text-gray-600 dark:text-gray-400">Traditional Crafts</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Our Promise */}
                <section className="py-20">
                    <div className="container mx-auto px-4 md:px-8 max-w-4xl text-center">
                        <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-6">
                            Our Promise to Artisans
                        </h2>
                        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                            We believe in fair trade, not charity. Every artisan we work with receives fair wages,
                            timely payments, and the dignity their craft deserves. We invest in their communities
                            through healthcare support, education for their children, and skill development programs.
                        </p>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                                <span className="text-3xl font-bold text-amber-600">40%</span>
                                <p className="text-gray-600 dark:text-gray-300 mt-2">Higher wages than market average</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                                <span className="text-3xl font-bold text-amber-600">100%</span>
                                <p className="text-gray-600 dark:text-gray-300 mt-2">On-time payments guaranteed</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                                <span className="text-3xl font-bold text-amber-600">₹50L+</span>
                                <p className="text-gray-600 dark:text-gray-300 mt-2">Community investment yearly</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Artisan Stories */}
                <section className="py-20 bg-gray-50 dark:bg-gray-800">
                    <div className="container mx-auto px-4 md:px-8">
                        <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white text-center mb-12">
                            Meet Our Artisans
                        </h2>
                        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                            {artisanStories.map((artisan, index) => (
                                <div
                                    key={index}
                                    className="bg-white dark:bg-gray-700 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                                >
                                    <div className="h-48 bg-gradient-to-br from-amber-200 to-amber-300 dark:from-amber-900 dark:to-amber-800 flex items-center justify-center">
                                        <div className="w-24 h-24 bg-white/30 rounded-full flex items-center justify-center">
                                            <span className="text-4xl font-serif font-bold text-amber-800 dark:text-amber-200">
                                                {artisan.name.charAt(0)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{artisan.name}</h3>
                                        <p className="text-amber-600 dark:text-amber-400 font-medium">{artisan.craft}</p>
                                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <MapPin size={14} /> {artisan.location}
                                            </span>
                                            <span>{artisan.experience} experience</span>
                                        </div>
                                        <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                                            {artisan.story}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Crafts We Support */}
                <section className="py-20">
                    <div className="container mx-auto px-4 md:px-8 max-w-5xl">
                        <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white text-center mb-12">
                            Crafts We Preserve
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {crafts.map((craft, index) => (
                                <div
                                    key={index}
                                    className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-600 transition-colors"
                                >
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{craft.name}</h3>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{craft.description}</p>
                                    <span className="text-amber-600 dark:text-amber-400 font-medium text-sm">
                                        {craft.artisans} artisans
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-20 bg-gradient-to-r from-amber-500 to-orange-500">
                    <div className="container mx-auto px-4 md:px-8 text-center">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
                            Support Traditional Craftsmanship
                        </h2>
                        <p className="text-gray-800 max-w-xl mx-auto mb-8">
                            Every purchase directly supports artisan families and helps preserve centuries-old traditions.
                        </p>
                        <a
                            href="/collections"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
                        >
                            Shop Artisan Collections
                        </a>
                    </div>
                </section>
            </main>
        </>
    );
};

export default Artisans;
