import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, ArrowRight, Sparkles, Award, Globe, Heart } from 'lucide-react';

interface BentoItem {
    id: string;
    type: 'featured' | 'video' | 'story' | 'stat' | 'cta';
    title?: string;
    subtitle?: string;
    description?: string;
    image?: string;
    videoUrl?: string;
    link?: string;
    stat?: { value: string; label: string };
    icon?: React.ReactNode;
    gridClass?: string;
}

const BENTO_ITEMS: BentoItem[] = [
    {
        id: '1',
        type: 'featured',
        title: 'New Arrivals',
        subtitle: 'Spring 2026',
        description: 'Discover our latest collection of handwoven silks',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800',
        link: '/collections?category=new',
        gridClass: 'bento-item-large'
    },
    {
        id: '2',
        type: 'video',
        title: 'The Art of Weaving',
        subtitle: 'Behind the Scenes',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-sewing-a-blue-cloth-in-a-factory-21251-large.mp4',
        image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?q=80&w=600',
        gridClass: 'bento-item-tall'
    },
    {
        id: '3',
        type: 'stat',
        stat: { value: '500+', label: 'Artisan Partners' },
        icon: <Award className="w-8 h-8" />,
        gridClass: ''
    },
    {
        id: '4',
        type: 'story',
        title: 'Heritage Meets Modern',
        description: 'Traditional techniques with contemporary designs',
        image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=600',
        link: '/our-story',
        gridClass: ''
    },
    {
        id: '5',
        type: 'stat',
        stat: { value: '50+', label: 'Countries Shipped' },
        icon: <Globe className="w-8 h-8" />,
        gridClass: ''
    },
    {
        id: '6',
        type: 'cta',
        title: 'Bridal Collection',
        subtitle: 'Exclusive Preview',
        description: 'Book your private consultation',
        image: 'https://images.unsplash.com/photo-1632766329767-f3d2f97c8386?q=80&w=600',
        link: '/collections?category=bridal',
        gridClass: 'bento-item-wide'
    },
    {
        id: '7',
        type: 'stat',
        stat: { value: '12+', label: 'Years of Trust' },
        icon: <Heart className="w-8 h-8" />,
        gridClass: ''
    },
    {
        id: '8',
        type: 'story',
        title: 'Sustainable Fashion',
        description: 'Eco-conscious luxury for the modern woman',
        image: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?q=80&w=600',
        link: '/sustainability',
        gridClass: ''
    }
];

export default function BentoHeritageGrid() {
    return (
        <section className="py-24 relative overflow-hidden" aria-labelledby="bento-heading">
            {/* Background texture */}
            <div className="texture-layer" />
            <div className="luxury-gradient absolute inset-0" />

            <div className="container mx-auto px-4 md:px-8 relative z-10">
                {/* Section Header */}
                <header className="text-center max-w-3xl mx-auto mb-16">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-vermilion font-semibold tracking-[0.2em] uppercase text-sm mb-4"
                    >
                        <Sparkles className="inline w-4 h-4 mr-2" />
                        Explore Our World
                    </motion.p>
                    <motion.h2
                        id="bento-heading"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="font-serif text-4xl md:text-5xl font-bold mb-6"
                    >
                        <span className="text-gray-900 dark:text-white">The </span>
                        <span className="gold-shimmer">Heritage</span>
                        <span className="text-gray-900 dark:text-white"> Experience</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed"
                    >
                        Discover stories, collections, and the craftsmanship behind every piece
                    </motion.p>
                </header>

                {/* Bento Grid */}
                <div className="bento-grid">
                    {BENTO_ITEMS.map((item, index) => (
                        <BentoCard key={item.id} item={item} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function BentoCard({ item, index }: { item: BentoItem; index: number }) {
    const baseClasses = "glass-card spotlight-card relative overflow-hidden group cursor-pointer";
    const delayedAnimation = { delay: index * 0.1, duration: 0.5 };

    if (item.type === 'stat') {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={delayedAnimation}
                className={`${baseClasses} ${item.gridClass} flex flex-col items-center justify-center p-8 text-center min-h-[200px]`}
            >
                <div className="text-gold mb-4 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
                    {item.icon}
                </div>
                <div className="text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mb-2">
                    {item.stat?.value}
                </div>
                <div className="text-gray-500 dark:text-gray-400 font-medium">
                    {item.stat?.label}
                </div>
            </motion.div>
        );
    }

    if (item.type === 'video') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={delayedAnimation}
                className={`${baseClasses} ${item.gridClass} min-h-[400px]`}
            >
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${item.image})` }}
                />

                {/* Video Overlay (plays on hover) */}
                {item.videoUrl && (
                    <video
                        className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        src={item.videoUrl}
                        muted
                        loop
                        playsInline
                        onMouseEnter={(e) => e.currentTarget.play()}
                        onMouseLeave={(e) => {
                            e.currentTarget.pause();
                            e.currentTarget.currentTime = 0;
                        }}
                    />
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 group-hover:bg-gold transition-all duration-300">
                        <Play className="w-8 h-8 text-white fill-white ml-1" />
                    </div>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-gold text-sm font-semibold uppercase tracking-wider mb-2">
                        {item.subtitle}
                    </p>
                    <h3 className="text-white text-2xl font-serif font-bold">
                        {item.title}
                    </h3>
                </div>
            </motion.div>
        );
    }

    if (item.type === 'featured' || item.type === 'cta') {
        return (
            <Link href={item.link || '#'}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={delayedAnimation}
                    className={`${baseClasses} ${item.gridClass} min-h-[400px]`}
                >
                    {/* Background Image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url(${item.image})` }}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-all" />

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                        <p className="text-gold text-sm font-semibold uppercase tracking-wider mb-2">
                            {item.subtitle}
                        </p>
                        <h3 className="text-white text-2xl md:text-3xl font-serif font-bold mb-3">
                            {item.title}
                        </h3>
                        {item.description && (
                            <p className="text-white/80 mb-4">{item.description}</p>
                        )}
                        <span className="inline-flex items-center gap-2 text-gold font-semibold group-hover:gap-4 transition-all">
                            Explore
                            <ArrowRight className="w-4 h-4" />
                        </span>
                    </div>
                </motion.div>
            </Link>
        );
    }

    // Story type
    return (
        <Link href={item.link || '#'}>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={delayedAnimation}
                className={`${baseClasses} ${item.gridClass} min-h-[200px]`}
            >
                {/* Background Image */}
                {item.image && (
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url(${item.image})` }}
                    />
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-white text-lg md:text-xl font-serif font-bold mb-2">
                        {item.title}
                    </h3>
                    {item.description && (
                        <p className="text-white/70 text-sm line-clamp-2">{item.description}</p>
                    )}
                </div>
            </motion.div>
        </Link>
    );
}
