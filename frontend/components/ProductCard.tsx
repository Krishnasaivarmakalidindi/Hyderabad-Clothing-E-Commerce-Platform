// ProductCard Component - Complete implementation with all required fields
// Displays product image, name, price, rating, wishlist, and add to cart functionality

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Product, FALLBACK_IMAGE } from '../types/product';

interface ProductCardProps {
    product: Product;
    onAddToCart?: (product: Product) => void;
    onToggleWishlist?: (product: Product) => void;
    isInWishlist?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
    product,
    onAddToCart,
    onToggleWishlist,
    isInWishlist = false,
}) => {
    const [imageError, setImageError] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);

    const handleImageError = useCallback(() => {
        setImageError(true);
    }, []);

    const handleAddToCart = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onAddToCart) {
            onAddToCart(product);
        }
    }, [onAddToCart, product]);

    const handleToggleWishlist = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onToggleWishlist) {
            onToggleWishlist(product);
        }
    }, [onToggleWishlist, product]);

    // Generate star rating display
    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(
                    <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                );
            } else if (i === fullStars && hasHalfStar) {
                stars.push(
                    <svg key={i} className="w-4 h-4 text-yellow-400" viewBox="0 0 20 20">
                        <defs>
                            <linearGradient id={`half-${product.id}`}>
                                <stop offset="50%" stopColor="currentColor" />
                                <stop offset="50%" stopColor="#D1D5DB" />
                            </linearGradient>
                        </defs>
                        <path fill={`url(#half-${product.id})`} d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                );
            } else {
                stars.push(
                    <svg key={i} className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                );
            }
        }
        return stars;
    };

    const imageUrl = imageError ? FALLBACK_IMAGE : (product.images[0] || FALLBACK_IMAGE);

    return (
        <motion.div
            className="group relative bg-white dark:bg-[#1A1A1A] rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl dark:shadow-black/20"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Link href={`/products/${product.slug}`}>
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                    <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={handleImageError}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        quality={70}
                        placeholder="blur"
                        blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA="
                        unoptimized
                    />

                    {/* Discount Badge */}
                    {product.discountPercentage > 0 && (
                        <div className="absolute top-3 left-3 bg-vermilion text-white px-2 py-1 rounded-md text-xs font-bold shadow-lg">
                            -{product.discountPercentage}%
                        </div>
                    )}

                    {/* New Arrival Badge */}
                    {product.isNewArrival && (
                        <div className="absolute top-3 right-12 bg-gold text-gray-900 px-2 py-1 rounded-md text-xs font-bold shadow-lg">
                            NEW
                        </div>
                    )}

                    {/* Wishlist Button */}
                    <button
                        onClick={handleToggleWishlist}
                        className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors z-10"
                        aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                        <svg
                            className={`w-5 h-5 transition-colors ${isInWishlist ? 'text-red-500 fill-red-500' : 'text-gray-600'}`}
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            fill={isInWishlist ? 'currentColor' : 'none'}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>

                    {/* Out of Stock Overlay */}
                    {!product.inStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold">
                                Out of Stock
                            </span>
                        </div>
                    )}

                    {/* Quick View on Hover */}
                    <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 transform transition-all duration-300 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                        <button
                            onClick={handleAddToCart}
                            disabled={!product.inStock}
                            className="w-full bg-white text-gray-900 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                    </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                    {/* Category & Brand */}
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-vermilion dark:text-gold font-medium uppercase tracking-wide">
                            {product.category}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {product.brand}
                        </span>
                    </div>

                    {/* Product Name */}
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 min-h-[40px] group-hover:text-vermilion dark:group-hover:text-gold transition-colors">
                        {product.name}
                    </h3>

                    {/* Available Sizes */}
                    <div className="flex flex-wrap gap-1 mb-2">
                        {product.availableSizes.slice(0, 4).map((size) => (
                            <span
                                key={size}
                                className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded"
                            >
                                {size}
                            </span>
                        ))}
                        {product.availableSizes.length > 4 && (
                            <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded">
                                +{product.availableSizes.length - 4}
                            </span>
                        )}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                        <div className="flex">{renderStars(product.averageRating)}</div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                            {product.averageRating.toFixed(1)} ({product.ratingCount})
                        </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                            {product.currency}{product.price.toLocaleString('en-IN')}
                        </span>
                        {product.originalPrice > product.price && (
                            <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                                {product.currency}{product.originalPrice.toLocaleString('en-IN')}
                            </span>
                        )}
                    </div>

                    {/* Material Tag */}
                    <div className="mt-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            Material: {product.material}
                        </span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default ProductCard;
