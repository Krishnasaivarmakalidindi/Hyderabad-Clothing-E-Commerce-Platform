import React from 'react';
import Head from 'next/head';
import { Newspaper, Download, Mail, Camera, Award, ExternalLink } from 'lucide-react';

const Press = () => {
    const pressReleases = [
        {
            date: 'January 2026',
            title: 'Hyderabad Clothing Launches Sustainable Packaging Initiative',
            excerpt: 'New eco-friendly packaging made from recycled materials and natural fibers.',
        },
        {
            date: 'December 2025',
            title: 'Partnership with 100 New Artisan Families in Telangana',
            excerpt: 'Expanding our network to support traditional weavers in rural communities.',
        },
        {
            date: 'October 2025',
            title: 'Featured in Vogue India\'s "Brands Preserving Heritage"',
            excerpt: 'Recognition for our efforts in keeping traditional handloom techniques alive.',
        },
        {
            date: 'August 2025',
            title: 'Launch of Bridal Collection "Nizam\'s Legacy"',
            excerpt: 'Exclusive collection inspired by the royal heritage of Hyderabad.',
        },
    ];

    const awards = [
        { year: '2025', title: 'Best Sustainable Fashion Brand', org: 'India Fashion Awards' },
        { year: '2024', title: 'Excellence in Artisan Empowerment', org: 'FICCI' },
        { year: '2024', title: 'Heritage Brand of the Year', org: 'Telangana Government' },
        { year: '2023', title: 'Top 50 D2C Brands in India', org: 'Economic Times' },
    ];

    const mediaFeatures = [
        { name: 'Vogue India', type: 'Magazine' },
        { name: 'The Hindu', type: 'Newspaper' },
        { name: 'NDTV', type: 'Television' },
        { name: 'Forbes India', type: 'Magazine' },
        { name: 'YourStory', type: 'Digital' },
        { name: 'Elle India', type: 'Magazine' },
    ];

    return (
        <>
            <Head>
                <title>Press & Media | Hyderabad Clothing</title>
                <meta name="description" content="Press releases, media coverage, and brand assets for Hyderabad Clothing. Contact our PR team for inquiries." />
            </Head>

            <main className="min-h-screen bg-white dark:bg-gray-900">
                {/* Hero Section */}
                <section className="relative py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
                    <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/20">
                            <Newspaper size={40} className="text-gray-900" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
                            Press & Media
                        </h1>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            Stories of heritage, craftsmanship, and the artisans behind every thread.
                        </p>
                    </div>
                </section>

                {/* Media Contact */}
                <section className="py-12 bg-amber-50 dark:bg-gray-800">
                    <div className="container mx-auto px-4 md:px-8">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Media Inquiries</h2>
                                <p className="text-gray-600 dark:text-gray-300">For press inquiries, interviews, and collaborations</p>
                            </div>
                            <a
                                href="mailto:press@hyderabadclothing.com"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-gray-900 font-semibold rounded-xl hover:bg-amber-600 transition-colors"
                            >
                                <Mail size={18} />
                                press@hyderabadclothing.com
                            </a>
                        </div>
                    </div>
                </section>

                {/* Press Releases */}
                <section className="py-20">
                    <div className="container mx-auto px-4 md:px-8 max-w-4xl">
                        <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-8">
                            Press Releases
                        </h2>
                        <div className="space-y-6">
                            {pressReleases.map((release, index) => (
                                <div
                                    key={index}
                                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow"
                                >
                                    <span className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                                        {release.date}
                                    </span>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-2 mb-2">
                                        {release.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                                        {release.excerpt}
                                    </p>
                                    <button className="text-amber-600 dark:text-amber-400 font-medium hover:underline inline-flex items-center gap-1">
                                        Read More <ExternalLink size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Awards */}
                <section className="py-20 bg-gray-50 dark:bg-gray-800">
                    <div className="container mx-auto px-4 md:px-8 max-w-4xl">
                        <div className="flex items-center gap-4 mb-8">
                            <Award size={32} className="text-amber-500" />
                            <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">
                                Awards & Recognition
                            </h2>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            {awards.map((award, index) => (
                                <div
                                    key={index}
                                    className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-100 dark:border-gray-600"
                                >
                                    <span className="text-amber-600 dark:text-amber-400 font-bold">{award.year}</span>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1">{award.title}</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">{award.org}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Featured In */}
                <section className="py-20">
                    <div className="container mx-auto px-4 md:px-8 max-w-4xl text-center">
                        <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-8">
                            Featured In
                        </h2>
                        <div className="flex flex-wrap justify-center gap-8">
                            {mediaFeatures.map((media, index) => (
                                <div key={index} className="text-center">
                                    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-2">
                                        <span className="text-2xl font-serif font-bold text-gray-400">{media.name.charAt(0)}</span>
                                    </div>
                                    <span className="font-medium text-gray-900 dark:text-white block">{media.name}</span>
                                    <span className="text-sm text-gray-500">{media.type}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Brand Assets */}
                <section className="py-20 bg-gradient-to-r from-amber-500 to-amber-600">
                    <div className="container mx-auto px-4 md:px-8 text-center">
                        <Camera size={48} className="text-gray-900 mx-auto mb-6" />
                        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
                            Brand Assets
                        </h2>
                        <p className="text-gray-800 max-w-xl mx-auto mb-8">
                            Download our official logos, product images, and brand guidelines for media use.
                        </p>
                        <button className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors">
                            <Download size={20} />
                            Download Press Kit
                        </button>
                    </div>
                </section>
            </main>
        </>
    );
};

export default Press;
