import React from 'react';
import Head from 'next/head';
import { Shirt, Droplets, Wind, Sun, AlertTriangle, Sparkles, ThermometerSun, Scissors } from 'lucide-react';

const CareGuide = () => {
    const fabricCare = [
        {
            fabric: 'Silk Sarees',
            icon: Sparkles,
            color: 'from-purple-500 to-pink-500',
            tips: [
                'Dry clean recommended for best results',
                'If hand washing, use cold water with mild detergent',
                'Never wring or twist silk fabric',
                'Dry in shade, away from direct sunlight',
                'Iron on low heat with a cotton cloth between iron and silk',
                'Store wrapped in muslin or cotton cloth',
                'Use silica gel packets to prevent moisture damage'
            ]
        },
        {
            fabric: 'Cotton Sarees & Kurtas',
            icon: Wind,
            color: 'from-blue-500 to-cyan-500',
            tips: [
                'Machine wash on gentle cycle with cold water',
                'Use mild detergent without bleach',
                'Turn garments inside out before washing',
                'Dry in shade to prevent color fading',
                'Iron while slightly damp for best results',
                'Store in a cool, dry place',
                'Separate whites and colors when washing'
            ]
        },
        {
            fabric: 'Zari & Brocade Work',
            icon: Sparkles,
            color: 'from-amber-500 to-yellow-500',
            tips: [
                'Always dry clean zari work garments',
                'Never iron directly on zari/metallic threads',
                'Store flat or on padded hangers',
                'Wrap in acid-free tissue paper',
                'Keep away from moisture and humidity',
                'Avoid perfume or deodorant contact',
                'Air out periodically to prevent tarnishing'
            ]
        },
        {
            fabric: 'Kalamkari & Printed Fabrics',
            icon: Shirt,
            color: 'from-orange-500 to-red-500',
            tips: [
                'First wash: soak in cold water with salt to set colors',
                'Always wash separately for first 2-3 washes',
                'Use cold water and mild detergent',
                'Avoid soaking for extended periods',
                'Dry in shade to preserve print colors',
                'Iron on reverse side to protect prints',
                'Store away from direct light'
            ]
        },
        {
            fabric: 'Wool & Pashmina',
            icon: ThermometerSun,
            color: 'from-gray-500 to-slate-600',
            tips: [
                'Dry clean recommended for best care',
                'If hand washing, use lukewarm water',
                'Use wool-specific detergent',
                'Never wring - gently squeeze out water',
                'Lay flat to dry on a towel',
                'Store folded with cedar or lavender',
                'Never hang wool garments - they will stretch'
            ]
        },
        {
            fabric: 'Linen',
            icon: Sun,
            color: 'from-green-500 to-emerald-500',
            tips: [
                'Machine wash on gentle cycle',
                'Use lukewarm water',
                'Linen softens beautifully with each wash',
                'Dry flat or hang to dry',
                'Iron while damp for crisp finish',
                'Embrace natural wrinkles - they add character',
                'Store loosely - avoid tight folding'
            ]
        }
    ];

    const generalTips = [
        {
            icon: Droplets,
            title: 'Water Temperature',
            description: 'Cold water is safest for most ethnic fabrics. Hot water can cause shrinkage and color bleeding.'
        },
        {
            icon: Sun,
            title: 'Drying',
            description: 'Always dry in shade. Direct sunlight can fade colors, especially in silk and printed fabrics.'
        },
        {
            icon: AlertTriangle,
            title: 'Stain Removal',
            description: 'Act quickly! Blot (don\'t rub) stains. For delicate fabrics, consult a professional cleaner.'
        },
        {
            icon: Scissors,
            title: 'Minor Repairs',
            description: 'Address loose threads and minor damages promptly to prevent further deterioration.'
        }
    ];

    return (
        <>
            <Head>
                <title>Fabric Care Guide | Hyderabad Clothing</title>
                <meta name="description" content="Learn how to care for your precious ethnic wear. Expert tips for silk sarees, cotton kurtas, zari work, and more." />
            </Head>

            <main className="min-h-screen bg-white dark:bg-gray-900">
                {/* Hero Section */}
                <section className="relative py-24 bg-gradient-to-br from-teal-900 via-teal-800 to-cyan-900 overflow-hidden">
                    <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <Shirt size={40} className="text-white" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
                            Fabric Care Guide
                        </h1>
                        <p className="text-xl text-teal-100 max-w-2xl mx-auto">
                            Preserve the beauty and longevity of your handcrafted treasures with proper care.
                        </p>
                    </div>
                </section>

                {/* Introduction */}
                <section className="py-16 bg-teal-50 dark:bg-gray-800">
                    <div className="container mx-auto px-4 md:px-8 max-w-4xl text-center">
                        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                            Handwoven and handcrafted garments deserve special attention. With proper care, your ethnic wear
                            will maintain its beauty for generations. Follow our fabric-specific guidelines to ensure your
                            precious pieces stay as stunning as the day you received them.
                        </p>
                    </div>
                </section>

                {/* General Tips */}
                <section className="py-16">
                    <div className="container mx-auto px-4 md:px-8 max-w-5xl">
                        <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white text-center mb-8">
                            Essential Care Tips
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {generalTips.map((tip, index) => (
                                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-700 text-center">
                                    <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                                        <tip.icon size={24} className="text-teal-600 dark:text-teal-400" />
                                    </div>
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">{tip.title}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">{tip.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Fabric-Specific Care */}
                <section className="py-20 bg-gray-50 dark:bg-gray-800">
                    <div className="container mx-auto px-4 md:px-8">
                        <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white text-center mb-12">
                            Care by Fabric Type
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {fabricCare.map((fabric, index) => (
                                <div
                                    key={index}
                                    className="bg-white dark:bg-gray-700 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                                >
                                    <div className={`h-24 bg-gradient-to-r ${fabric.color} flex items-center justify-center`}>
                                        <fabric.icon size={40} className="text-white" />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                            {fabric.fabric}
                                        </h3>
                                        <ul className="space-y-3">
                                            {fabric.tips.map((tip, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                                                    <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-1.5 flex-shrink-0" />
                                                    {tip}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Storage Tips */}
                <section className="py-20">
                    <div className="container mx-auto px-4 md:px-8 max-w-4xl">
                        <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white text-center mb-8">
                            Storage Best Practices
                        </h2>
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">Do's</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                                            <span className="text-green-500 font-bold">✓</span>
                                            Store in breathable cotton or muslin covers
                                        </li>
                                        <li className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                                            <span className="text-green-500 font-bold">✓</span>
                                            Use silica gel packets to absorb moisture
                                        </li>
                                        <li className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                                            <span className="text-green-500 font-bold">✓</span>
                                            Refold sarees differently every 6 months
                                        </li>
                                        <li className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                                            <span className="text-green-500 font-bold">✓</span>
                                            Air out garments periodically
                                        </li>
                                        <li className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                                            <span className="text-green-500 font-bold">✓</span>
                                            Keep camphor or neem leaves for pest protection
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">Don'ts</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                                            <span className="text-red-500 font-bold">✗</span>
                                            Never store in plastic bags (traps moisture)
                                        </li>
                                        <li className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                                            <span className="text-red-500 font-bold">✗</span>
                                            Avoid direct sunlight in storage area
                                        </li>
                                        <li className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                                            <span className="text-red-500 font-bold">✗</span>
                                            Don't store with heavy items on top
                                        </li>
                                        <li className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                                            <span className="text-red-500 font-bold">✗</span>
                                            Never fold on same creases repeatedly
                                        </li>
                                        <li className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                                            <span className="text-red-500 font-bold">✗</span>
                                            Don't store perfumed items with silk
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Help Banner */}
                <section className="py-16 bg-gradient-to-r from-teal-600 to-cyan-600">
                    <div className="container mx-auto px-4 md:px-8 text-center">
                        <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4">
                            Need Care Advice?
                        </h2>
                        <p className="text-teal-100 max-w-xl mx-auto mb-6">
                            Our team is happy to help with specific care questions about your purchase.
                        </p>
                        <a
                            href="/contact"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-teal-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            Contact Our Care Team
                        </a>
                    </div>
                </section>
            </main>
        </>
    );
};

export default CareGuide;
