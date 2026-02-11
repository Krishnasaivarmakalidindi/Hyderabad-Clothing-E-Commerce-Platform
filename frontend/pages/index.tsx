import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { ShoppingBag } from 'lucide-react';
import Layout from '../components/Layout';
import Featured3DSlider from '../components/Featured3DSlider';
import GlassProductCard from '../components/GlassProductCard';
import BentoHeritageGrid from '../components/BentoHeritageGrid';
import ScrollytellingOrigin from '../components/ScrollytellingOrigin';
import MagazineNavigation from '../components/MagazineNavigation';
import { FEATURED_PRODUCTS_HOME, products } from '../data/products';

// Carousel Items - using unified product data
const CAROUSEL_ITEMS = products.slice(0, 6).map(p => ({
    id: String(p.id),
    name: p.name,
    category: p.category.toUpperCase(),
    price: `₹${p.price.toLocaleString()}`,
    image: p.images[0]
}));

// Custom SVG Icons for Feature Grid
const LoomIcon = () => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
        <path d="M8 12h32M8 24h32M8 36h32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M16 8v32M24 8v32M32 8v32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="16" cy="12" r="2" fill="currentColor" />
        <circle cx="24" cy="24" r="2" fill="currentColor" />
        <circle cx="32" cy="36" r="2" fill="currentColor" />
    </svg>
);

const ArtisanIcon = () => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
        <path d="M24 4l4 8 8 1-6 6 1.5 8.5L24 23l-7.5 4.5L18 19l-6-6 8-1 4-8z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M12 32c0 6 5.373 10 12 10s12-4 12-10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M18 35l3 3 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const GlobalExpressIcon = () => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
        <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="2.5" />
        <ellipse cx="24" cy="24" rx="8" ry="16" stroke="currentColor" strokeWidth="2" />
        <path d="M8 24h32M24 8v32" stroke="currentColor" strokeWidth="2" />
        <path d="M32 12l8-4M32 36l8 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
);

const ReturnsIcon = () => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
        <path d="M12 24c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M36 24c0 6.627-5.373 12-12 12s-12-5.373-12-12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 4" />
        <path d="M8 20l4 4 4-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 22l4 4 8-8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// Featured Products - using unified data from products.ts
const FEATURED_PRODUCTS = FEATURED_PRODUCTS_HOME;

// Stats data
const STATS = [
    { label: 'Happy Customers', value: 5000, suffix: '+' },
    { label: 'Curated Products', value: 1200, suffix: '+' },
    { label: 'Years of Trust', value: 12, suffix: '+' },
    { label: 'Cities Served', value: 150, suffix: '+' }
];

export default function Home() {
    const { ref: statsRef, inView: statsInView } = useInView({ triggerOnce: true, threshold: 0.3 });
    const [activeIndex, setActiveIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [email, setEmail] = useState('');

    const updateCarousel = (newIndex: number) => {
        if (isAnimating) return;
        setIsAnimating(true);
        const length = CAROUSEL_ITEMS.length;
        const index = (newIndex + length) % length;
        setActiveIndex(index);
        setTimeout(() => setIsAnimating(false), 800);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isPaused && !isAnimating) {
                updateCarousel(activeIndex + 1);
            }
        }, 3000);
        return () => clearInterval(interval);
    }, [activeIndex, isPaused, isAnimating]);

    const getCardClass = (index: number) => {
        const length = CAROUSEL_ITEMS.length;
        const offset = (index - activeIndex + length) % length;
        if (offset === 0) return 'center';
        if (offset === 1) return 'down-1';
        if (offset === 2) return 'down-2';
        if (offset === length - 1) return 'up-1';
        if (offset === length - 2) return 'up-2';
        return 'hidden';
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowUp') updateCarousel(activeIndex - 1);
            if (e.key === 'ArrowDown') updateCarousel(activeIndex + 1);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeIndex, isAnimating]);

    const features = [
        {
            icon: <LoomIcon />,
            title: 'Straight from Our Looms',
            desc: 'Every piece is handwoven by master artisans in Hyderabad. No middlemen, just pure craftsmanship.',
            color: 'bg-vermilion-50 text-vermilion'
        },
        {
            icon: <ArtisanIcon />,
            title: 'Artisan Certified',
            desc: 'Each product carries a certificate of authenticity, guaranteeing genuine handloom quality.',
            color: 'bg-gold-50 text-gold'
        },
        {
            icon: <GlobalExpressIcon />,
            title: 'Global Express',
            desc: 'From Hyderabad to your doorstep worldwide. Express shipping with real-time tracking.',
            color: 'bg-teal-50 text-teal'
        },
        {
            icon: <ReturnsIcon />,
            title: 'Risk-Free Elegance',
            desc: 'Not satisfied? Return within 14 days for a full refund. Your happiness is our priority.',
            color: 'bg-vermilion-50 text-vermilion'
        }
    ];

    return (
        <Layout>
            <Head>
                <title>Hyderabad Clothing | Luxury Ethnic Wear Boutique Hyderabad - Premium Silks & Handlooms</title>
                <meta name="description" content="Discover heritage reimagined at Hyderabad Clothing. Shop authentic Ikat, Zardozi, and handwoven silks curated by master artisans. Premium ethnic wear delivered worldwide." />
                <meta name="keywords" content="Luxury Ethnic Wear Boutique Hyderabad, Ikat sarees, Zardozi lehenga, handloom silk, designer ethnic wear" />
            </Head>

            {/* Hero Section - 3D Carousel */}
            <header className="relative overflow-hidden bg-gradient-to-br from-pearl-100 via-pearl to-pearl-200" role="banner">
                <div className="container mx-auto px-4 md:px-8 py-8 lg:py-16">
                    <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 min-h-[calc(100vh-120px)]">
                        {/* Carousel Section */}
                        <div className="w-full lg:w-1/2 flex justify-center items-center order-1 lg:order-1">
                            <div
                                className="carousel-container"
                                onMouseEnter={() => setIsPaused(true)}
                                onMouseLeave={() => setIsPaused(false)}
                            >
                                <div className="carousel-track">
                                    {CAROUSEL_ITEMS.map((item, i) => (
                                        <div
                                            key={item.id}
                                            className={`card ${getCardClass(i)}`}
                                            onClick={() => updateCarousel(i)}
                                        >
                                            <img src={item.image} alt={item.name} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-2 py-8">
                            {/* Navigation Arrows */}
                            <div className="flex gap-2 mb-6">
                                <button
                                    className="w-12 h-12 rounded-full border-2 border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-white transition-all"
                                    onClick={() => updateCarousel(activeIndex - 1)}
                                    aria-label="Previous item"
                                >
                                    <FaChevronUp size={16} />
                                </button>
                                <button
                                    className="w-12 h-12 rounded-full border-2 border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-white transition-all"
                                    onClick={() => updateCarousel(activeIndex + 1)}
                                    aria-label="Next item"
                                >
                                    <FaChevronDown size={16} />
                                </button>
                            </div>

                            {/* Text Content */}
                            <p className="text-gold font-semibold tracking-[0.2em] uppercase text-sm mb-4">
                                Curated by Master Artisans
                            </p>
                            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                                <span className="text-gold dark:text-gold">Heritage</span><br />
                                <span className="reimagined-text italic">Reimagined</span>
                            </h1>
                            <p className="font-serif text-xl md:text-2xl text-vermilion mb-4">
                                Hyderabad's Finest Silks, Now Online
                            </p>
                            <p className="text-lg text-[#4A4A4A] dark:text-gray-300 max-w-md mb-8">
                                Curated by master artisans for your most cherished moments.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href="/collections"
                                    className="bg-vermilion text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-vermilion/30 hover:bg-vermilion-600 hover:shadow-xl hover:-translate-y-1 transition-all inline-flex items-center justify-center gap-2"
                                    aria-label="Start shopping our collection"
                                >
                                    Explore Collection
                                    <ShoppingBag size={18} strokeWidth={2} />
                                </Link>
                                <Link
                                    href="/our-story"
                                    className="bg-white dark:bg-[#1A1A1A] text-gray-900 dark:text-white border-2 border-gold/30 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gold hover:text-white hover:border-gold transition-all inline-flex items-center justify-center gap-2"
                                    aria-label="Learn about our heritage"
                                >
                                    Our Heritage
                                </Link>
                            </div>

                            {/* Color Dots - Smaller with variety */}
                            <div className="flex gap-3 mt-8">
                                {[
                                    { color: 'bg-gold', ring: 'ring-gold/50' },
                                    { color: 'bg-[#C9A962]', ring: 'ring-[#C9A962]/50' },
                                    { color: 'bg-vermilion', ring: 'ring-vermilion/50' },
                                    { color: 'bg-[#E8D4A0]', ring: 'ring-[#E8D4A0]/50' },
                                    { color: 'bg-[#8B7355]', ring: 'ring-[#8B7355]/50' },
                                    { color: 'bg-[#D4B896]', ring: 'ring-[#D4B896]/50' }
                                ].map((dot, i) => (
                                    <button
                                        key={i}
                                        className={`w-6 h-6 rounded-full transition-all duration-300 ${dot.color} ${i === activeIndex ? `ring-2 ${dot.ring} ring-offset-2 scale-110` : 'opacity-70 hover:opacity-100 hover:scale-105'}`}
                                        onClick={() => updateCarousel(i)}
                                        aria-label={`Go to slide ${i + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <style jsx>{`
                /* Reimagined text color animation */
                .reimagined-text {
                    background: linear-gradient(
                        90deg,
                        #E34234,
                        #B59410,
                        #008080,
                        #E34234
                    );
                    background-size: 300% 100%;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    animation: colorShift 6s ease-in-out infinite;
                }

                @keyframes colorShift {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }

                .carousel-container {
                    width: 100%;
                    max-width: 400px;
                    height: 500px;
                    position: relative;
                    perspective: 1500px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }

                .carousel-track {
                    width: 280px;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    position: relative;
                    transform-style: preserve-3d;
                }

                .card {
                    position: absolute;
                    width: 280px;
                    height: 380px;
                    background: transparent;
                    border-radius: 16px;
                    overflow: hidden;
                    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
                    cursor: pointer;
                }

                .card img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
                    filter: drop-shadow(0 10px 20px rgba(0,0,0,0.15));
                    border-radius: 16px;
                }

                .card.center {
                    z-index: 10;
                    transform: scale(1.05) translateZ(60px);
                }

                .card.center img {
                    filter: drop-shadow(0 25px 40px rgba(0,0,0,0.25));
                }

                .card.up-2 {
                    z-index: 1;
                    transform: translateY(-200px) scale(0.7) translateZ(-150px);
                    opacity: 0.3;
                }

                .card.up-2 img {
                    filter: grayscale(100%);
                }

                .card.up-1 {
                    z-index: 5;
                    transform: translateY(-100px) scale(0.85) translateZ(-80px);
                    opacity: 0.7;
                }

                .card.up-1 img {
                    filter: grayscale(50%);
                }

                .card.down-1 {
                    z-index: 5;
                    transform: translateY(100px) scale(0.85) translateZ(-80px);
                    opacity: 0.7;
                }

                .card.down-1 img {
                    filter: grayscale(50%);
                }

                .card.down-2 {
                    z-index: 1;
                    transform: translateY(200px) scale(0.7) translateZ(-150px);
                    opacity: 0.3;
                }

                .card.down-2 img {
                    filter: grayscale(100%);
                }

                .card.hidden {
                    opacity: 0;
                    pointer-events: none;
                }

                @media (min-width: 1024px) {
                    .carousel-container {
                        max-width: 450px;
                        height: 600px;
                    }

                    .carousel-track {
                        width: 320px;
                    }

                    .card {
                        width: 320px;
                        height: 450px;
                    }

                    .card.up-2 {
                        transform: translateY(-240px) scale(0.7) translateZ(-180px);
                    }

                    .card.up-1 {
                        transform: translateY(-120px) scale(0.85) translateZ(-90px);
                    }

                    .card.down-1 {
                        transform: translateY(120px) scale(0.85) translateZ(-90px);
                    }

                    .card.down-2 {
                        transform: translateY(240px) scale(0.7) translateZ(-180px);
                    }
                }

                @media (max-width: 640px) {
                    .carousel-container {
                        max-width: 300px;
                        height: 420px;
                    }

                    .carousel-track {
                        width: 220px;
                    }

                    .card {
                        width: 220px;
                        height: 300px;
                    }

                    .card.up-2 {
                        transform: translateY(-160px) scale(0.7) translateZ(-120px);
                    }

                    .card.up-1 {
                        transform: translateY(-80px) scale(0.85) translateZ(-60px);
                    }

                    .card.down-1 {
                        transform: translateY(80px) scale(0.85) translateZ(-60px);
                    }

                    .card.down-2 {
                        transform: translateY(160px) scale(0.7) translateZ(-120px);
                    }
                }
            `}</style>

            {/* Why Shop With Us - Feature Grid - White Background */}
            <section className="py-24 bg-white" aria-labelledby="features-heading">
                <div className="container mx-auto px-4 md:px-8">
                    <header className="text-center max-w-3xl mx-auto mb-16">
                        <p className="text-vermilion font-semibold tracking-[0.2em] uppercase text-sm mb-4">
                            The Hyderabad Difference
                        </p>
                        <h2 id="features-heading" className="font-serif text-4xl md:text-5xl font-bold text-gold mb-6">
                            Why Shop With Us
                        </h2>
                        <p className="text-xl text-gray-600 leading-relaxed">
                            Experience the convenience of online shopping with the trust of a heritage boutique.
                        </p>
                    </header>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((item, i) => (
                            <motion.article
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                className="group p-8 rounded-3xl bg-pearl dark:bg-[#1A1A1A] border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:shadow-gray-200/50 dark:hover:shadow-black/30 hover:-translate-y-2 transition-all duration-500"
                            >
                                <div className={`w-16 h-16 rounded-2xl ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    {item.icon}
                                </div>
                                <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{item.desc}</p>
                            </motion.article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products - Pearl Background with Glass Cards */}
            <section className="py-24 bg-gradient-to-b from-pearl to-pearl-200 dark:from-[#121212] dark:to-[#1A1A1A] relative" aria-labelledby="products-heading">
                <div className="texture-layer" />
                <div className="container mx-auto px-4 md:px-8 relative z-10">
                    <header className="text-center max-w-3xl mx-auto mb-16">
                        <p className="text-vermilion font-semibold tracking-[0.2em] uppercase text-sm mb-4">
                            Curated Excellence
                        </p>
                        <h2 id="products-heading" className="font-serif text-4xl md:text-5xl font-bold mb-6">
                            <span className="text-[#1F1F1F] dark:text-white">Featured </span>
                            <span className="gold-shimmer">Collection</span>
                        </h2>
                        <p className="text-xl text-[#4A4A4A] dark:text-gray-300 leading-relaxed">
                            Hover to see our fabrics come alive. Each piece tells a story of heritage.
                        </p>
                    </header>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {FEATURED_PRODUCTS.map((product, i) => (
                            <GlassProductCard
                                key={product.id}
                                id={product.id}
                                name={product.name}
                                price={product.price}
                                originalPrice={product.originalPrice}
                                category={product.category}
                                image={product.image}
                                videoUrl={product.videoUrl}
                                tag={product.tag}
                                index={i}
                            />
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Link
                            href="/collections"
                            className="inline-flex items-center gap-2 bg-vermilion text-white font-semibold px-10 py-4 rounded-full hover:bg-vermilion-600 hover:shadow-xl hover:shadow-vermilion/30 transition-all duration-300 haptic-click"
                            aria-label="View all products in our collection"
                        >
                            View All Products
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Bento Heritage Grid - New Section */}
            <BentoHeritageGrid />

            {/* Magazine-Style Category Navigation */}
            <MagazineNavigation />

            {/* Scrollytelling Origin Story */}
            <ScrollytellingOrigin />

            {/* Featured 3D Slider */}
            <Featured3DSlider />

            {/* Stats Section - Vermilion Background */}
            <section
                className="py-20 bg-vermilion text-white relative overflow-hidden"
                ref={statsRef}
                aria-labelledby="stats-heading"
            >
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:32px_32px]" />
                </div>
                <div className="container mx-auto px-4 md:px-8 relative z-10">
                    <h2 id="stats-heading" className="sr-only">Our Achievements</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {STATS.map((stat, i) => (
                            <div key={i} className="space-y-2">
                                <div className="text-5xl md:text-6xl font-serif font-bold">
                                    {statsInView ? <CountUp end={stat.value} duration={2.5} /> : 0}
                                    {stat.suffix}
                                </div>
                                <div className="text-vermilion-100 font-medium text-lg">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter Section - Teal Background */}
            <section className="py-24 newsletter-teal" aria-labelledby="newsletter-heading">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 id="newsletter-heading" className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
                            Join 5,000+ Women for Exclusive Early Access
                        </h2>
                        <p className="text-xl text-teal-100 mb-10 leading-relaxed">
                            Be the first to discover our 2026 Festive Drops. Get styling tips, exclusive offers, and artisan stories delivered to your inbox.
                        </p>
                        <form
                            className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto"
                            onSubmit={(e) => e.preventDefault()}
                        >
                            <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                            <input
                                id="newsletter-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address"
                                className="flex-1 px-6 py-4 rounded-full text-gray-900 bg-white focus:outline-none focus:ring-4 focus:ring-gold/50"
                                required
                                aria-required="true"
                            />
                            <button
                                type="submit"
                                className="bg-gold text-white font-bold px-8 py-4 rounded-full hover:bg-gold-600 hover:shadow-lg transition-all duration-300"
                                aria-label="Subscribe to our newsletter"
                            >
                                Join the List
                            </button>
                        </form>
                        <p className="text-teal-200 text-sm mt-6">
                            Unsubscribe anytime. We respect your privacy.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section - Dark Background */}
            <section className="py-24 bg-[#121212] section-transition-dark" aria-labelledby="cta-heading">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="rounded-3xl p-12 md:p-20 text-center relative overflow-hidden">
                        <div className="absolute -top-24 -right-24 w-80 h-80 bg-vermilion rounded-full blur-[100px] opacity-30" />
                        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-gold rounded-full blur-[100px] opacity-20" />

                        <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                            <h2 id="cta-heading" className="font-serif text-4xl md:text-6xl font-bold text-white leading-tight">
                                Experience the{' '}
                                <span className="text-gold italic">Elegance</span>
                                <br />of Hyderabad
                            </h2>
                            <p className="text-xl text-gray-300 leading-relaxed">
                                Your journey to timeless style begins here. Authentic handlooms, delivered with care.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                                <Link
                                    href="/collections"
                                    className="bg-vermilion text-white px-12 py-5 rounded-full font-bold text-lg hover:bg-vermilion-600 hover:scale-105 transition-all shadow-xl shadow-vermilion/30"
                                    aria-label="Start shopping our luxury collection"
                                >
                                    Start Shopping
                                </Link>
                                <Link
                                    href="/contact"
                                    className="bg-transparent text-white px-12 py-5 rounded-full font-bold text-lg border-2 border-white/30 hover:bg-white/10 hover:border-white transition-all"
                                    aria-label="Contact us for personalized assistance"
                                >
                                    Book a Consultation
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
