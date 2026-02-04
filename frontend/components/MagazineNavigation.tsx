import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';

interface Category {
    id: string;
    name: string;
    description: string;
    image: string;
    productCount: number;
    featured?: boolean;
}

const CATEGORIES: Category[] = [
    {
        id: 'sarees',
        name: 'Sarees',
        description: 'Timeless elegance woven in silk',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800',
        productCount: 156,
        featured: true
    },
    {
        id: 'lehengas',
        name: 'Lehengas',
        description: 'Bridal dreams come true',
        image: 'https://images.unsplash.com/photo-1632766329767-f3d2f97c8386?q=80&w=800',
        productCount: 84,
        featured: true
    },
    {
        id: 'kurtas',
        name: 'Kurtas',
        description: 'Contemporary comfort meets tradition',
        image: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?q=80&w=800',
        productCount: 112
    },
    {
        id: 'mens',
        name: "Men's Ethnic",
        description: 'Sophisticated styles for him',
        image: 'https://www.nicobar.com/cdn/shop/files/NBI030558_1.jpg?v=1696738242',
        productCount: 67
    },
    {
        id: 'kids',
        name: 'Kids',
        description: 'Little traditions, big smiles',
        image: 'https://m.media-amazon.com/images/I/61FKajl2nEL._AC_UY1100_.jpg',
        productCount: 45
    },
    {
        id: 'fabrics',
        name: 'Fabrics',
        description: 'Create your own masterpiece',
        image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?q=80&w=800',
        productCount: 89
    }
];

export default function MagazineNavigation() {
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<string>(CATEGORIES[0].id);

    const currentCategory = CATEGORIES.find(c => c.id === (hoveredCategory || activeCategory)) || CATEGORIES[0];

    return (
        <section className="py-24 bg-[#121212] relative overflow-hidden section-transition-dark" aria-labelledby="categories-heading">
            {/* Background Image (changes based on hover) */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentCategory.id}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 0.3, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url(${currentCategory.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                />
            </AnimatePresence>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#121212] via-[#121212]/95 to-[#121212]/80" />

            <div className="container mx-auto px-4 md:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left: Category List */}
                    <div>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-gold font-semibold tracking-[0.2em] uppercase text-sm mb-4"
                        >
                            Shop by Category
                        </motion.p>
                        <motion.h2
                            id="categories-heading"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="font-serif text-4xl md:text-5xl font-bold text-white mb-12"
                        >
                            Explore Our <span className="italic text-gold">Collections</span>
                        </motion.h2>

                        <div className="space-y-2">
                            {CATEGORIES.map((category, index) => (
                                <motion.div
                                    key={category.id}
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link
                                        href={`/collections?category=${category.name}`}
                                        className="group flex items-center justify-between py-4 px-6 rounded-2xl transition-all duration-300 hover:bg-white/10"
                                        onMouseEnter={() => setHoveredCategory(category.id)}
                                        onMouseLeave={() => setHoveredCategory(null)}
                                        onClick={() => setActiveCategory(category.id)}
                                    >
                                        <div className="flex items-center gap-6">
                                            {/* Number */}
                                            <span className="text-2xl font-serif text-gold/50 group-hover:text-gold transition-colors w-8">
                                                {String(index + 1).padStart(2, '0')}
                                            </span>

                                            {/* Category Name */}
                                            <div>
                                                <h3 className={`font-serif text-2xl md:text-3xl font-bold transition-all duration-300 ${
                                                    hoveredCategory === category.id || (!hoveredCategory && activeCategory === category.id)
                                                        ? 'text-white'
                                                        : 'text-gray-400 group-hover:text-white'
                                                }`}>
                                                    {category.name}
                                                </h3>
                                                <p className="text-gray-500 text-sm mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {category.productCount} products
                                                </p>
                                            </div>
                                        </div>

                                        {/* Arrow */}
                                        <ChevronRight
                                            className={`w-6 h-6 transition-all duration-300 ${
                                                hoveredCategory === category.id
                                                    ? 'text-gold translate-x-0 opacity-100'
                                                    : 'text-gray-600 -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                                            }`}
                                        />
                                    </Link>

                                    {/* Divider */}
                                    {index < CATEGORIES.length - 1 && (
                                        <div className="h-px bg-white/10 mx-6" />
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Featured Category Preview */}
                    <div className="hidden lg:block">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentCategory.id}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                transition={{ duration: 0.4 }}
                                className="relative"
                            >
                                {/* Main Image */}
                                <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl">
                                    <img
                                        src={currentCategory.image}
                                        alt={currentCategory.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                    {/* Content Overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 p-8">
                                        {currentCategory.featured && (
                                            <span className="inline-block bg-gold text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                                                Featured
                                            </span>
                                        )}
                                        <h3 className="font-serif text-3xl font-bold text-white mb-2">
                                            {currentCategory.name}
                                        </h3>
                                        <p className="text-white/80 mb-6">
                                            {currentCategory.description}
                                        </p>
                                        <Link
                                            href={`/collections?category=${currentCategory.name}`}
                                            className="inline-flex items-center gap-2 bg-white text-gray-900 font-semibold px-6 py-3 rounded-full hover:bg-gold hover:text-white transition-all duration-300 haptic-click"
                                        >
                                            Explore {currentCategory.name}
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>

                                {/* Product Count Badge */}
                                <div className="absolute -top-4 -right-4 bg-vermilion text-white w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-lg">
                                    <span className="text-2xl font-bold">{currentCategory.productCount}</span>
                                    <span className="text-xs opacity-80">Products</span>
                                </div>

                                {/* Decorative Elements */}
                                <div className="absolute -bottom-6 -left-6 w-32 h-32 border-2 border-gold/30 rounded-3xl -z-10" />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Mobile: View All Button */}
                <div className="mt-12 text-center lg:hidden">
                    <Link
                        href="/collections"
                        className="inline-flex items-center gap-2 bg-gold text-white font-semibold px-8 py-4 rounded-full hover:bg-gold-600 transition-all duration-300"
                    >
                        View All Categories
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
