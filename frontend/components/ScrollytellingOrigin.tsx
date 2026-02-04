import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

interface JourneyStep {
    id: string;
    step: number;
    title: string;
    subtitle: string;
    description: string;
    image: string;
    stats: { value: string; label: string };
}

const JOURNEY_STEPS: JourneyStep[] = [
    {
        id: 'silk',
        step: 1,
        title: 'The Raw Silk',
        subtitle: 'Sourcing',
        description: 'Our journey begins in the mulberry farms of Karnataka, where the finest silk cocoons are carefully selected. Each strand carries centuries of tradition.',
        image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?q=80&w=800',
        stats: { value: '100%', label: 'Pure Mulberry Silk' }
    },
    {
        id: 'dye',
        step: 2,
        title: 'Natural Dyes',
        subtitle: 'Coloring',
        description: 'In the dye houses of Hyderabad, master craftsmen create vibrant hues using traditional vegetable dyes that deepen beautifully with age.',
        image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=800',
        stats: { value: '50+', label: 'Color Variants' }
    },
    {
        id: 'weave',
        step: 3,
        title: 'The Handloom',
        subtitle: 'Weaving',
        description: 'On wooden looms passed through generations, our weavers bring patterns to life. Each saree takes 15-45 days of dedicated craftsmanship.',
        image: 'https://images.unsplash.com/photo-1594040226829-7f251ab46d80?q=80&w=800',
        stats: { value: '500+', label: 'Artisan Partners' }
    },
    {
        id: 'finish',
        step: 4,
        title: 'Final Touch',
        subtitle: 'Finishing',
        description: 'Every piece undergoes meticulous quality checks and finishing touches. The result is a garment that tells a story of heritage and excellence.',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800',
        stats: { value: '12+', label: 'Years of Excellence' }
    }
];

export default function ScrollytellingOrigin() {
    return (
        <section className="py-24 bg-gradient-to-b from-pearl via-white to-pearl dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden" aria-labelledby="journey-heading">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23B59410' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }} />
            </div>

            <div className="container mx-auto px-4 md:px-8 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-3xl mx-auto mb-20"
                >
                    <p className="text-vermilion font-semibold tracking-[0.2em] uppercase text-sm mb-4 flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        The Journey
                    </p>
                    <h2 id="journey-heading" className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                        <span className="text-gray-900 dark:text-white">From Loom to </span>
                        <span className="text-gold italic">You</span>
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                        Every piece tells a story of heritage, craftsmanship, and generations of expertise
                    </p>
                </motion.div>

                {/* Journey Timeline */}
                <div className="relative">
                    {/* Connecting Line - Desktop */}
                    <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-gold/20 via-gold to-gold/20 -translate-x-1/2" />

                    {/* Journey Steps */}
                    <div className="space-y-16 lg:space-y-24">
                        {JOURNEY_STEPS.map((step, index) => (
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="relative"
                            >
                                {/* Step Number Circle - Desktop Center */}
                                <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                                    <div className="w-16 h-16 rounded-full bg-gold text-white flex items-center justify-center shadow-lg shadow-gold/30">
                                        <span className="text-2xl font-serif font-bold">{step.step}</span>
                                    </div>
                                </div>

                                <div className={`grid lg:grid-cols-2 gap-8 lg:gap-20 items-center ${index % 2 === 1 ? '' : ''}`}>
                                    {/* Image */}
                                    <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                                        <div className="relative group">
                                            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                                                <img
                                                    src={step.image}
                                                    alt={step.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                                {/* Overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                                                {/* Step Badge - Mobile */}
                                                <div className="lg:hidden absolute top-4 left-4 w-10 h-10 rounded-full bg-gold text-white flex items-center justify-center shadow-lg">
                                                    <span className="text-lg font-bold">{step.step}</span>
                                                </div>

                                                {/* Subtitle Badge */}
                                                <div className="absolute top-4 right-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                                                    <span className="text-sm font-semibold text-gold uppercase tracking-wide">{step.subtitle}</span>
                                                </div>

                                                {/* Stats Badge */}
                                                <div className="absolute bottom-4 left-4 bg-vermilion text-white px-5 py-3 rounded-2xl">
                                                    <div className="text-2xl font-serif font-bold">{step.stats.value}</div>
                                                    <div className="text-xs opacity-90">{step.stats.label}</div>
                                                </div>
                                            </div>

                                            {/* Decorative Frame */}
                                            <div className={`absolute -z-10 ${index % 2 === 0 ? '-bottom-4 -right-4' : '-bottom-4 -left-4'} w-full h-full border-2 border-gold/20 rounded-3xl`} />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className={`${index % 2 === 1 ? 'lg:order-1 lg:text-right' : ''}`}>
                                        <div className={`max-w-lg ${index % 2 === 1 ? 'lg:ml-auto' : ''}`}>
                                            <motion.div
                                                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.6, delay: 0.2 }}
                                            >
                                                {/* Step indicator line */}
                                                <div className={`flex items-center gap-4 mb-6 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                                                    <div className="hidden lg:flex w-12 h-12 rounded-full bg-gold/10 items-center justify-center">
                                                        <span className="text-xl font-serif font-bold text-gold">{step.step}</span>
                                                    </div>
                                                    <div className={`h-px flex-1 bg-gradient-to-r ${index % 2 === 1 ? 'lg:from-transparent lg:to-gold/50 from-gold/50 to-transparent' : 'from-gold/50 to-transparent'}`} />
                                                </div>

                                                <h3 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                                    {step.title}
                                                </h3>

                                                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                                                    {step.description}
                                                </p>

                                                <Link
                                                    href={`/our-story#${step.id}`}
                                                    className={`inline-flex items-center gap-2 text-gold font-semibold hover:gap-4 transition-all group ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
                                                >
                                                    <span>Discover more</span>
                                                    <ArrowRight className={`w-4 h-4 transition-transform ${index % 2 === 1 ? 'lg:rotate-180 group-hover:-translate-x-2' : 'group-hover:translate-x-2'}`} />
                                                </Link>
                                            </motion.div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mt-24"
                >
                    <div className="inline-block p-8 rounded-3xl bg-[#121212] dark:bg-[#1A1A1A] relative overflow-hidden">
                        {/* Background Glow */}
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gold/20 rounded-full blur-3xl" />
                        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-vermilion/20 rounded-full blur-3xl" />

                        <div className="relative z-10">
                            <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-4">
                                Experience the Craft
                            </h3>
                            <p className="text-[#C8C8C8] mb-6 max-w-md mx-auto">
                                Each piece in our collection carries this heritage. Discover your story.
                            </p>
                            <Link
                                href="/collections"
                                className="inline-flex items-center gap-3 bg-gold text-gray-900 font-semibold px-8 py-4 rounded-full hover:bg-gold-400 hover:gap-5 transition-all duration-300 shadow-lg shadow-gold/30 haptic-click"
                            >
                                Explore Collection
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
