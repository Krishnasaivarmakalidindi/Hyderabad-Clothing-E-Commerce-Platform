import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { FaStar, FaHeart, FaTruck, FaUndo, FaShieldAlt, FaRuler, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import Layout from '../../components/Layout';
import ProductCard from '../../components/ProductCard';
import dynamic from 'next/dynamic';
import { products, getProductBySlug, getProductById } from '../../data/products';
import { Product, FALLBACK_IMAGE, Size, ProductCategory } from '../../types/product';
import { productsAPI } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export default function ProductDetail() {
    const router = useRouter();
    const { id } = router.query;
    const { isLoggedIn } = useAuth();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState<Size | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    const normalizeApiProduct = (data: any): Product => {
        const price = Number(data.price) || 0;
        const mrp = Number(data.mrp) || price;
        const variants = Array.isArray(data.variants) ? data.variants : [];
        const sizes = variants
            .map((v: any) => v.size)
            .filter(Boolean) as Size[];

        const totalStockFromVariants = variants.reduce((sum: number, v: any) => {
            const stock = Number(v.stock_available) || 0;
            return sum + stock;
        }, 0);

        const category = (data.category as ProductCategory) || 'Sarees';

        const discount = mrp > 0 ? Math.max(0, Math.round(((mrp - price) / mrp) * 100)) : 0;

        return {
            id: Number(data.id) || 0,
            slug: data.slug || String(data.id),
            name: data.name_en || data.name || 'Product',
            category,
            subcategory: data.subcategory || '',
            brand: data.seller_name || 'Brand',
            description: data.description_en || data.description || '',
            price,
            originalPrice: mrp || price,
            discountPercentage: discount,
            currency: '₹',
            availableSizes: sizes.length ? sizes : ['Free Size'],
            sizeChart: undefined,
            fitType: 'Regular',
            weight: Number(data.weight) || 0,
            length: Number(data.length) || 0,
            width: Number(data.width) || 0,
            height: Number(data.height) || 0,
            material: data.fabric_type || data.material || 'Fabric',
            averageRating: Number(data.average_rating) || 4.5,
            ratingCount: Number(data.total_reviews) || 0,
            popularityScore: 0,
            reviews: [],
            stockQuantity: Number(data.total_stock) || totalStockFromVariants || 0,
            inStock: (data.status || 'active') === 'active' && (Number(data.total_stock) > 0 || totalStockFromVariants > 0),
            isNewArrival: Boolean(data.featured),
            isFeatured: Boolean(data.featured),
            images: Array.isArray(data.images) ? data.images : [],
        };
    };

    // Prefer live API, fall back to static data
    useEffect(() => {
        if (!id) return;

        const load = async () => {
            setLoading(true);
            const idString = Array.isArray(id) ? id[0] : id;

            // Try API first
            try {
                const res = await productsAPI.getById(idString);
                const apiProduct = res.data?.data;
                if (apiProduct) {
                    const normalized = normalizeApiProduct(apiProduct);
                    setProduct(normalized);
                    if (normalized.availableSizes.length > 0) {
                        setSelectedSize(normalized.availableSizes[0]);
                    }
                    setLoading(false);
                    return;
                }
            } catch (apiErr) {
                console.warn('Falling back to static product data:', apiErr);
            }

            // Fallback to static dataset (slug first, then numeric id)
            let foundProduct = getProductBySlug(idString);
            if (!foundProduct) {
                const numId = parseInt(idString);
                if (!isNaN(numId)) {
                    foundProduct = getProductById(numId);
                }
            }

            if (foundProduct) {
                setProduct(foundProduct);
                if (foundProduct.availableSizes.length > 0) {
                    setSelectedSize(foundProduct.availableSizes[0]);
                }
            }

            setLoading(false);
        };

        load();
    }, [id]);

    // Get related products (same category, different product)
    const relatedProducts = useMemo(() => {
        if (!product) return [];
        return products
            .filter(p => p.category === product.category && p.id !== product.id)
            .slice(0, 4);
    }, [product]);

    // Add-to-cart is now handled inside AddToCartButton via buildPayload

    const handleRatingSubmit = (rating: number) => {
        setUserRating(rating);
        // Mock rating submission
        const notification = document.createElement('div');
        notification.className = 'fixed top-24 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-xl z-50 flex items-center gap-2 font-medium';
        // Use textContent instead of innerHTML to prevent XSS
        notification.textContent = `Thank you for rating! You gave ${rating} stars.`;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    };

    const renderStars = (rating: number, interactive = false) => {
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => interactive && handleRatingSubmit(star)}
                        onMouseEnter={() => interactive && setHoverRating(star)}
                        onMouseLeave={() => interactive && setHoverRating(0)}
                        className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
                        disabled={!interactive}
                    >
                        <FaStar
                            size={interactive ? 24 : 14}
                            className={`${star <= (interactive ? (hoverRating || userRating) : rating)
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                                } transition-colors`}
                        />
                    </button>
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center bg-pearl dark:bg-gray-900">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gold"></div>
                </div>
            </Layout>
        );
    }

    if (!product) {
        return (
            <Layout>
                <Head>
                    <title>Product Not Found - Hyderabad Clothing</title>
                </Head>
                <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-pearl dark:bg-gray-900">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Product not found</h2>
                    <Link href="/collections" className="text-gold hover:underline">Back to Collections</Link>
                </div>
            </Layout>
        );
    }

    const discount = product.discountPercentage;
    const imageUrl = imageError ? FALLBACK_IMAGE : (product.images[activeImage] || product.images[0] || FALLBACK_IMAGE);

    return (
        <Layout>
            <Head>
                <title>{product.name} - Hyderabad Clothing</title>
                <meta name="description" content={product.description} />
            </Head>
            <div className="bg-gradient-to-b from-pearl via-white to-pearl dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen py-8">
                <div className="container mx-auto px-4 md:px-6">
                    {/* Breadcrumbs */}
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-8">
                        <Link href="/" className="hover:text-gold transition-colors">Home</Link>
                        <span className="mx-2">/</span>
                        <Link href="/collections" className="hover:text-gold transition-colors">Collections</Link>
                        <span className="mx-2">/</span>
                        <Link href={`/collections?category=${encodeURIComponent(product.category)}`} className="hover:text-gold transition-colors">{product.category}</Link>
                        <span className="mx-2">/</span>
                        <span className="text-gray-900 dark:text-white font-medium truncate max-w-xs">{product.name}</span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 mb-20">
                        {/* Image Gallery */}
                        <div className="space-y-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="aspect-[4/5] glass-card rounded-3xl overflow-hidden relative flex items-center justify-center group"
                            >
                                <Image
                                    src={imageUrl}
                                    alt={product.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    onError={() => setImageError(true)}
                                    priority
                                    sizes="(min-width: 768px) 50vw, 100vw"
                                    quality={70}
                                    placeholder="blur"
                                    blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA="
                                    unoptimized
                                />
                                {discount > 0 && (
                                    <div className="absolute top-4 left-4 bg-vermilion text-white px-4 py-1.5 rounded-full font-bold text-sm z-10 shadow-lg">
                                        {discount}% OFF
                                    </div>
                                )}
                                {product.isNewArrival && (
                                    <div className="absolute top-4 right-4 bg-gold text-gray-900 px-4 py-1.5 rounded-full font-bold text-sm z-10 shadow-lg">
                                        NEW
                                    </div>
                                )}
                            </motion.div>
                            {product.images && product.images.length > 1 && (
                                <div className="grid grid-cols-4 gap-4">
                                    {product.images.map((img: string, i: number) => (
                                        <button
                                            key={i}
                                            onClick={() => { setActiveImage(i); setImageError(false); }}
                                            className={`aspect-square rounded-xl glass-card border-2 transition-all overflow-hidden ${activeImage === i ? 'border-gold ring-2 ring-gold/30' : 'border-transparent hover:border-gold/50'}`}
                                        >
                                            <Image
                                                src={img}
                                                alt={`View ${i + 1}`}
                                                width={100}
                                                height={100}
                                                className="w-full h-full object-cover"
                                                unoptimized
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="text-sm text-gold font-semibold uppercase tracking-wider">{product.category} • {product.subcategory}</span>
                                        <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 dark:text-white mt-1">{product.name}</h1>
                                    </div>
                                    <button
                                        onClick={() => setIsWishlisted(!isWishlisted)}
                                        className={`p-3 rounded-full glass-card transition-all haptic-click ${isWishlisted ? 'text-vermilion' : 'text-gray-400 dark:text-gray-500 hover:text-vermilion'}`}
                                    >
                                        <FaHeart size={24} className={isWishlisted ? 'fill-vermilion heart-bounce' : ''} />
                                    </button>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">by <span className="font-medium text-gray-900 dark:text-white">{product.brand}</span></p>

                                <div className="flex items-center gap-4 mt-4">
                                    <div className="text-3xl font-bold text-gold">{product.currency}{product.price.toLocaleString('en-IN')}</div>
                                    {product.originalPrice > product.price && (
                                        <div className="text-xl text-gray-400 line-through">{product.currency}{product.originalPrice.toLocaleString('en-IN')}</div>
                                    )}
                                </div>

                                <div className="flex items-center gap-3 mt-3">
                                    {renderStars(product.averageRating)}
                                    <span className="text-gray-600 dark:text-gray-300 font-medium">{product.averageRating.toFixed(1)}</span>
                                    <span className="text-gray-400 dark:text-gray-500 text-sm">({product.ratingCount} reviews)</span>
                                </div>

                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-4">
                                    {product.description}
                                </p>
                            </div>

                            <hr className="border-gray-200 dark:border-gray-700" />

                            {/* Size Selection */}
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-gray-900 dark:text-white">Select Size</h3>
                                    <Link href="/size-guide" className="text-gold text-sm font-medium hover:underline flex items-center gap-1">
                                        <FaRuler size={12} /> Size Guide
                                    </Link>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {product.availableSizes.map((size: Size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`min-w-[3rem] h-12 px-4 rounded-xl font-bold border-2 transition-all haptic-click ${selectedSize === size
                                                ? 'border-gold bg-gold text-gray-900'
                                                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gold dark:hover:border-gold'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>

                                {/* Stock Status */}
                                <div className="mt-3 text-sm">
                                    {product.inStock ? (
                                        product.stockQuantity < 10 ? (
                                            <span className="text-amber-500 font-medium flex items-center gap-1">
                                                <FaExclamationCircle /> Hurry! Only {product.stockQuantity} left in stock.
                                            </span>
                                        ) : (
                                            <span className="text-emerald-500 font-medium flex items-center gap-1">
                                                <FaCheckCircle /> In Stock
                                            </span>
                                        )
                                    ) : (
                                        <span className="text-vermilion font-medium flex items-center gap-1">
                                            <FaExclamationCircle /> Out of Stock
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Product Details */}
                            <div className="glass-card rounded-2xl p-5 space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Material</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{product.material}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Fit Type</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{product.fitType}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Weight</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{product.weight}g</span>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <AddToCartButton
                                    productId={product.id}
                                    productName={product.name}
                                    price={product.price}
                                    image={product.images[0] || FALLBACK_IMAGE}
                                    size={selectedSize || undefined}
                                    buildPayload={() => ({
                                        productId: product.id,
                                        productName: product.name,
                                        price: product.price,
                                        image: product.images[0] || FALLBACK_IMAGE,
                                        size: selectedSize || undefined,
                                        quantity,
                                    })}
                                />
                            </div>

                            {/* Trust Signals */}
                            <div className="grid grid-cols-3 gap-4 text-center text-xs text-gray-500 dark:text-gray-400 pt-4">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-12 h-12 glass-card rounded-xl flex items-center justify-center text-gold">
                                        <FaShieldAlt size={18} />
                                    </div>
                                    <span>Genuine Product</span>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-12 h-12 glass-card rounded-xl flex items-center justify-center text-gold">
                                        <FaTruck size={18} />
                                    </div>
                                    <span>Fast Delivery</span>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-12 h-12 glass-card rounded-xl flex items-center justify-center text-gold">
                                        <FaUndo size={18} />
                                    </div>
                                    <span>Easy Returns</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Rate This Product & Reviews */}
                    <div className="grid lg:grid-cols-3 gap-12 mb-20">
                        <div className="lg:col-span-2">
                            {/* Rate This Product */}
                            <div className="glass-card p-6 rounded-2xl mb-8">
                                <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-4">Rate This Product</h3>
                                <div className="flex items-center gap-4">
                                    {renderStars(userRating, true)}
                                    {userRating > 0 && (
                                        <span className="text-emerald-500 font-medium">Thanks for your rating!</span>
                                    )}
                                </div>
                            </div>

                            <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
                                Reviews ({product.ratingCount})
                            </h3>
                            <div className="space-y-6">
                                {product.reviews?.slice(0, 3).map((review: any) => (
                                    <div key={review.id} className="glass-card p-6 rounded-2xl">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-10 h-10 bg-gradient-to-br from-gold to-gold-600 rounded-full flex items-center justify-center font-bold text-gray-900">
                                                    {review.userName.split(' ').map((n: string) => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 dark:text-white">{review.userName}</p>
                                                    {renderStars(review.rating)}
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-400 dark:text-gray-500">
                                                {new Date(review.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-300">{review.comment}</p>
                                    </div>
                                ))}
                                {(!product.reviews || product.reviews.length === 0) && (
                                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                        No reviews yet. Be the first to review this product!
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">Brand Info</h3>
                            <div className="glass-card p-6 rounded-2xl">
                                <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{product.brand}</h4>
                                <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-4">
                                    <FaStar className="text-gold" />
                                    <span>Verified Seller</span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                                    Specializing in traditional handcrafted ethnic wear. Authentic products with quality assurance.
                                </p>
                                <Link href="/collections" className="text-gold font-bold text-sm hover:underline">
                                    View More Products
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
                        <div className="mb-12">
                            <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-8 text-center">You Might Also Like</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {relatedProducts.map((p) => (
                                    <ProductCard
                                        key={p.id}
                                        product={p}
                                        onAddToCart={() => { }}
                                        onToggleWishlist={() => { }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

// Client-only import - using SimpleAddToCartButton for reliability
const AddToCartButton = dynamic(() => import('../../components/SimpleAddToCartButton'), {
    ssr: false,
});
