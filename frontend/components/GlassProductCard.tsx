import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Eye } from 'lucide-react';

interface GlassProductCardProps {
    id: string;
    name: string;
    price: string;
    originalPrice?: string;
    category: string;
    image: string;
    videoUrl?: string;
    tag?: string;
    index?: number;
}

export default function GlassProductCard({
    id,
    name,
    price,
    originalPrice,
    category,
    image,
    videoUrl,
    tag,
    index = 0
}: GlassProductCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isLiked, setIsLiked] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);

    // Handle mouse move for spotlight effect
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        cardRef.current.style.setProperty('--mouse-x', `${x}%`);
        cardRef.current.style.setProperty('--mouse-y', `${y}%`);
    };

    const handleLike = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsLiked(!isLiked);
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 600);
    };

    return (
        <motion.article
            ref={cardRef}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            onMouseMove={handleMouseMove}
            className="group glass-card spotlight-card relative overflow-hidden cursor-pointer"
        >
            {/* Tag Badge */}
            {tag && (
                <div className="absolute top-4 left-4 z-20 bg-gold text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                    {tag}
                </div>
            )}

            {/* Quick Actions */}
            <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                <button
                    onClick={handleLike}
                    className={`w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm flex items-center justify-center shadow-lg haptic-click transition-all ${isLiked ? 'heart-bounce' : ''}`}
                    aria-label="Add to wishlist"
                >
                    <Heart
                        size={18}
                        className={isLiked ? 'fill-vermilion text-vermilion' : 'text-gray-600 dark:text-gray-300'}
                    />
                </button>
                <button
                    onClick={handleAddToCart}
                    className={`w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm flex items-center justify-center shadow-lg haptic-click transition-all ${addedToCart ? 'add-to-cart-success bg-gold' : ''}`}
                    aria-label="Add to cart"
                >
                    <ShoppingBag
                        size={18}
                        className={addedToCart ? 'text-white' : 'text-gray-600 dark:text-gray-300'}
                    />
                </button>
            </div>

            {/* Image Container */}
            <div className="relative aspect-[3/4] overflow-hidden">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                />

                {/* Video Overlay */}
                {videoUrl && (
                    <video
                        className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        src={videoUrl}
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

                {/* Gradient Overlay with Quick View */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                    <Link
                        href={`/product/${id}`}
                        className="w-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm text-gray-900 dark:text-white font-semibold py-3 rounded-xl text-center hover:bg-vermilion hover:text-white transition-colors flex items-center justify-center gap-2 haptic-click"
                        aria-label={`View details for ${name}`}
                    >
                        <Eye size={18} />
                        Quick View
                    </Link>
                </div>
            </div>

            {/* Product Info */}
            <div className="p-6 relative z-10">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">{category}</p>
                <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-gold transition-colors">
                    {name}
                </h3>
                <div className="flex items-center gap-2">
                    <span className="text-vermilion font-bold text-lg">{price}</span>
                    {originalPrice && (
                        <span className="text-gray-400 line-through text-sm">{originalPrice}</span>
                    )}
                </div>
            </div>

            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gold via-vermilion to-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        </motion.article>
    );
}
