// Collections Page - Complete implementation with filters, sorting, and search
// Fully functional e-commerce collections page

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';
import {
    Product,
    ProductCategory,
    SortOption,
    CATEGORY_CONFIG,
    SORT_OPTIONS,
    RATING_OPTIONS
} from '../types/product';
import { productsAPI } from '../lib/api';

// All available categories including 'All'
const CATEGORIES: (ProductCategory | 'All')[] = [
    'All',
    'Sarees',
    'Kurtas',
    'Lehengas',
    'Fabrics',
    'Mens Ethnic',
    'Kids'
];

const normalizeApiProduct = (data: any): Product => {
    const price = Number(data.price) || 0;
    const mrp = Number(data.mrp) || price;
    const variants = Array.isArray(data.variants) ? data.variants : [];
    const sizes = variants.map((v: any) => v.size).filter(Boolean);
    const totalStockFromVariants = variants.reduce((sum: number, v: any) => sum + (Number(v.stock_available) || 0), 0);
    const rawCategory = (data.category || '') as string;
    const allowedCategories: ProductCategory[] = ['Sarees', 'Kurtas', 'Lehengas', 'Fabrics', 'Mens Ethnic', 'Kids'];
    const category = allowedCategories.includes(rawCategory as ProductCategory)
        ? (rawCategory as ProductCategory)
        : 'Sarees';
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
        popularityScore: Number(data.popularity_score) || 0,
        reviews: [],
        stockQuantity: Number(data.total_stock) || totalStockFromVariants || 0,
        inStock: (data.status || 'active') === 'active' && (Number(data.total_stock) > 0 || totalStockFromVariants > 0),
        isNewArrival: Boolean(data.featured),
        isFeatured: Boolean(data.featured),
        images: Array.isArray(data.images) ? data.images : [],
    };
};

const computePriceBounds = (list: Product[]): [number, number] => {
    const prices = list.map(p => p.price).filter((p) => Number.isFinite(p));
    if (!prices.length) return [0, 30000];
    return [Math.min(...prices), Math.max(...prices)];
};

const CollectionsPage: React.FC = () => {
    const router = useRouter();

    // Get initial values from URL query params
    const queryCategory = router.query.category as string;
    const querySearch = router.query.q as string;
    const querySort = router.query.sort as SortOption;
    const queryMinPrice = router.query.minPrice as string;
    const queryMaxPrice = router.query.maxPrice as string;
    const queryRating = router.query.rating as string;

    // Filter & Sort State
    const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');
    const [sortBy, setSortBy] = useState<SortOption>('popular');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 30000]);
    const [minRating, setMinRating] = useState<number>(0);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    // Wishlist state (mock - would connect to context/API in production)
    const [wishlist, setWishlist] = useState<number[]>([]);

    // Products source (API first, fallback to static)
    const [productSource, setProductSource] = useState<Product[]>(products);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [apiError, setApiError] = useState<string | null>(null);
    const [minProductPrice, setMinProductPrice] = useState(0);
    const [maxProductPrice, setMaxProductPrice] = useState(30000);

    // Initialize state from URL query params
    useEffect(() => {
        if (queryCategory && CATEGORIES.includes(queryCategory as ProductCategory | 'All')) {
            setSelectedCategory(queryCategory as ProductCategory | 'All');
        }
        if (querySearch) {
            setSearchQuery(querySearch);
        }
        if (querySort && SORT_OPTIONS.some(opt => opt.value === querySort)) {
            setSortBy(querySort);
        }
        if (queryMinPrice) {
            setPriceRange(prev => [parseInt(queryMinPrice) || prev[0], prev[1]]);
        }
        if (queryMaxPrice) {
            setPriceRange(prev => [prev[0], parseInt(queryMaxPrice) || prev[1]]);
        }
        if (queryRating) {
            setMinRating(parseInt(queryRating) || 0);
        }
    }, [queryCategory, querySearch, querySort, queryMinPrice, queryMaxPrice, queryRating]);

    // Fetch products from API with graceful fallback
    useEffect(() => {
        const loadProducts = async () => {
            setLoadingProducts(true);
            try {
                const res = await productsAPI.getAll();
                const apiProducts = Array.isArray(res.data?.data?.products)
                    ? res.data.data.products
                    : Array.isArray(res.data?.data)
                        ? res.data.data
                        : [];

                if (apiProducts.length) {
                    const normalized = apiProducts.map((p: any) => normalizeApiProduct(p));
                    setProductSource(normalized);
                    const [minPrice, maxPrice] = computePriceBounds(normalized);
                    setMinProductPrice(minPrice);
                    setMaxProductPrice(maxPrice);
                    setPriceRange([minPrice, maxPrice]);
                    setApiError(null);
                    return;
                }
            } catch (err) {
                console.warn('Falling back to static products for collections:', err);
                setApiError('Showing showroom collection while we fetch live stock.');
            }

            // Fallback to static dataset
            setProductSource(products);
            const [minPrice, maxPrice] = computePriceBounds(products);
            setMinProductPrice(minPrice);
            setMaxProductPrice(maxPrice);
            setPriceRange([minPrice, maxPrice]);
        };

        loadProducts().finally(() => setLoadingProducts(false));
    }, []);

    // Update URL when filters change
    const updateURL = useCallback((params: Record<string, string | undefined>) => {
        const currentParams = new URLSearchParams(window.location.search);

        Object.entries(params).forEach(([key, value]) => {
            if (value && value !== 'All' && value !== '0' && value !== 'popular') {
                currentParams.set(key, value);
            } else {
                currentParams.delete(key);
            }
        });

        const newSearch = currentParams.toString();
        const newPath = newSearch ? `/collections?${newSearch}` : '/collections';

        router.replace(newPath, undefined, { shallow: true });
    }, [router]);

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        let result = [...productSource];

        // Apply search filter
        if (searchQuery.trim()) {
            const search = searchQuery.toLowerCase().trim();
            result = result.filter(product =>
                product.name.toLowerCase().includes(search) ||
                product.category.toLowerCase().includes(search) ||
                product.subcategory.toLowerCase().includes(search) ||
                product.brand.toLowerCase().includes(search) ||
                product.material.toLowerCase().includes(search) ||
                product.description?.toLowerCase().includes(search)
            );
        }

        // Apply category filter
        if (selectedCategory !== 'All') {
            result = result.filter(product => product.category === selectedCategory);
        }

        // Apply price range filter
        result = result.filter(product =>
            product.price >= priceRange[0] && product.price <= priceRange[1]
        );

        // Apply rating filter
        if (minRating > 0) {
            result = result.filter(product => product.averageRating >= minRating);
        }

        // Apply sorting
        switch (sortBy) {
            case 'popular':
                result.sort((a, b) => b.popularityScore - a.popularityScore);
                break;
            case 'price-low-high':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-high-low':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'highest-rated':
                result.sort((a, b) => b.averageRating - a.averageRating);
                break;
            case 'new-arrivals':
                result = result.filter(p => p.isNewArrival);
                result.sort((a, b) => b.popularityScore - a.popularityScore);
                break;
        }

        return result;
    }, [productSource, selectedCategory, priceRange, minRating, sortBy, searchQuery]);

    // Handler functions
    const handleCategoryChange = (category: ProductCategory | 'All') => {
        setSelectedCategory(category);
        updateURL({ category: category === 'All' ? undefined : category });
    };

    const handleSortChange = (sort: SortOption) => {
        setSortBy(sort);
        updateURL({ sort: sort === 'popular' ? undefined : sort });
    };

    const handlePriceChange = (min: number, max: number) => {
        setPriceRange([min, max]);
        updateURL({
            minPrice: min > minProductPrice ? min.toString() : undefined,
            maxPrice: max < maxProductPrice ? max.toString() : undefined
        });
    };

    const handleRatingChange = (rating: number) => {
        setMinRating(rating);
        updateURL({ rating: rating > 0 ? rating.toString() : undefined });
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateURL({ q: searchQuery.trim() || undefined });
    };

    const clearAllFilters = () => {
        setSelectedCategory('All');
        setSortBy('popular');
        setPriceRange([minProductPrice, maxProductPrice]);
        setMinRating(0);
        setSearchQuery('');
        router.replace('/collections', undefined, { shallow: true });
    };

    const toggleWishlist = (product: Product) => {
        setWishlist(prev =>
            prev.includes(product.id)
                ? prev.filter(id => id !== product.id)
                : [...prev, product.id]
        );
    };

    const handleAddToCart = (product: Product) => {
        // Mock add to cart - would connect to cart context in production
        console.log('Added to cart:', product.name);
        // Show toast notification
        alert(`${product.name} added to cart!`);
    };

    // Check if any filters are active
    const hasActiveFilters = selectedCategory !== 'All' ||
        minRating > 0 ||
        priceRange[0] > minProductPrice ||
        priceRange[1] < maxProductPrice ||
        searchQuery.trim() !== '';

    return (
        <Layout>
            <Head>
                <title>Collections - Hyderabad Clothing</title>
                <meta name="description" content="Browse our collection of traditional Indian ethnic wear including sarees, kurtas, lehengas, and more." />
            </Head>

            <div className="min-h-screen bg-pearl dark:bg-gray-900 transition-colors">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-vermilion to-vermilion-700 dark:from-[#121212] dark:to-[#1A1A1A] text-white py-12 relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:32px_32px]" />
                    </div>
                    <div className="container mx-auto px-4 relative z-10">
                        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-2">Our Collections</h1>
                        <p className="text-white/80 text-lg">
                            Discover authentic Indian ethnic wear crafted with love
                        </p>

                        {/* Search Bar */}
                        <form onSubmit={handleSearchSubmit} className="mt-6 max-w-xl">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    placeholder="Search products, categories, brands..."
                                    className="w-full px-4 py-3 pl-12 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
                                />
                                <svg
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <button
                                    type="submit"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-vermilion text-white px-4 py-1.5 rounded-md hover:bg-vermilion-600 transition-colors"
                                >
                                    Search
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                    {apiError && (
                        <div className="mb-4 rounded-lg bg-amber-50 text-amber-800 px-4 py-3 border border-amber-200 text-sm">
                            {apiError}
                        </div>
                    )}
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Mobile Filter Button */}
                        <button
                            onClick={() => setMobileFiltersOpen(true)}
                            className="lg:hidden flex items-center justify-center gap-2 bg-white dark:bg-[#1A1A1A] text-gray-900 dark:text-white py-3 px-4 rounded-lg shadow-md"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            Filters
                        </button>

                        {/* Sidebar Filters - Desktop */}
                        <aside className="hidden lg:block w-64 flex-shrink-0">
                            <div className="bg-white dark:bg-[#1A1A1A] rounded-xl shadow-md dark:shadow-black/20 p-6 sticky top-24">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Filters</h2>
                                    {hasActiveFilters && (
                                        <button
                                            onClick={clearAllFilters}
                                            className="text-sm text-vermilion dark:text-gold hover:underline"
                                        >
                                            Clear all
                                        </button>
                                    )}
                                </div>

                                {/* Categories */}
                                <div className="mb-6">
                                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                                        Categories
                                    </h3>
                                    <div className="space-y-2">
                                        {CATEGORIES.map((category) => (
                                            <button
                                                key={category}
                                                onClick={() => handleCategoryChange(category)}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === category
                                                    ? 'bg-vermilion text-white'
                                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                    }`}
                                            >
                                                <span className="flex items-center justify-between">
                                                    <span>
                                                        {category === 'All' ? 'All Products' : category}
                                                    </span>
                                                    <span className={`text-xs ${selectedCategory === category ? 'text-white/80' : 'text-gray-400 dark:text-gray-500'}`}>
                                                        {category === 'All'
                                                            ? productSource.length
                                                            : productSource.filter(p => p.category === category).length
                                                        }
                                                    </span>
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Range */}
                                <div className="mb-6">
                                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                                        Price Range
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">₹{priceRange[0].toLocaleString('en-IN')}</span>
                                            <span className="text-gray-400 dark:text-gray-500">-</span>
                                            <span className="text-sm text-gray-600 dark:text-gray-400">₹{priceRange[1].toLocaleString('en-IN')}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min={minProductPrice}
                                            max={maxProductPrice}
                                            value={priceRange[0]}
                                            onChange={(e) => handlePriceChange(parseInt(e.target.value), priceRange[1])}
                                            className="w-full accent-vermilion"
                                        />
                                        <input
                                            type="range"
                                            min={minProductPrice}
                                            max={maxProductPrice}
                                            value={priceRange[1]}
                                            onChange={(e) => handlePriceChange(priceRange[0], parseInt(e.target.value))}
                                            className="w-full accent-vermilion"
                                        />
                                        <div className="flex gap-2">
                                            <input
                                                type="number"
                                                value={priceRange[0]}
                                                onChange={(e) => handlePriceChange(parseInt(e.target.value) || minProductPrice, priceRange[1])}
                                                className="w-full px-2 py-1 border dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                                min={minProductPrice}
                                                max={priceRange[1]}
                                            />
                                            <input
                                                type="number"
                                                value={priceRange[1]}
                                                onChange={(e) => handlePriceChange(priceRange[0], parseInt(e.target.value) || maxProductPrice)}
                                                className="w-full px-2 py-1 border dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                                min={priceRange[0]}
                                                max={maxProductPrice}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Rating Filter */}
                                <div className="mb-6">
                                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                                        Rating
                                    </h3>
                                    <div className="space-y-2">
                                        <button
                                            onClick={() => handleRatingChange(0)}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${minRating === 0
                                                ? 'bg-vermilion text-white'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                }`}
                                        >
                                            All Ratings
                                        </button>
                                        {RATING_OPTIONS.map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => handleRatingChange(option.value)}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${minRating === option.value
                                                    ? 'bg-vermilion text-white'
                                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                    }`}
                                            >
                                                <div className="flex">
                                                    {[...Array(option.value)].map((_, i) => (
                                                        <svg key={i} className={`w-4 h-4 ${minRating === option.value ? 'text-yellow-300' : 'text-yellow-400'} fill-current`} viewBox="0 0 20 20">
                                                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                                        </svg>
                                                    ))}
                                                </div>
                                                <span>{option.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* Mobile Filters Drawer */}
                        <AnimatePresence>
                            {mobileFiltersOpen && (
                                <>
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                                        onClick={() => setMobileFiltersOpen(false)}
                                    />
                                    <motion.aside
                                        initial={{ x: '-100%' }}
                                        animate={{ x: 0 }}
                                        exit={{ x: '-100%' }}
                                        transition={{ type: 'spring', damping: 25 }}
                                        className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 overflow-y-auto lg:hidden"
                                    >
                                        <div className="p-6">
                                            <div className="flex items-center justify-between mb-6">
                                                <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                                                <button
                                                    onClick={() => setMobileFiltersOpen(false)}
                                                    className="p-2 hover:bg-gray-100 rounded-lg"
                                                >
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>

                                            {hasActiveFilters && (
                                                <button
                                                    onClick={clearAllFilters}
                                                    className="w-full mb-4 py-2 text-vermilion dark:text-gold border border-vermilion dark:border-gold rounded-lg hover:bg-vermilion/10 dark:hover:bg-gold/10 transition-colors"
                                                >
                                                    Clear all filters
                                                </button>
                                            )}

                                            {/* Categories - Mobile */}
                                            <div className="mb-6">
                                                <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                                                    Categories
                                                </h3>
                                                <div className="space-y-2">
                                                    {CATEGORIES.map((category) => (
                                                        <button
                                                            key={category}
                                                            onClick={() => {
                                                                handleCategoryChange(category);
                                                                setMobileFiltersOpen(false);
                                                            }}
                                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === category
                                                                ? 'bg-vermilion text-white'
                                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                                }`}
                                                        >
                                                            {category === 'All' ? 'All Products' : category}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Price Range - Mobile */}
                                            <div className="mb-6">
                                                <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                                                    Price Range
                                                </h3>
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm text-gray-600">₹{priceRange[0].toLocaleString('en-IN')}</span>
                                                        <span className="text-gray-400">-</span>
                                                        <span className="text-sm text-gray-600">₹{priceRange[1].toLocaleString('en-IN')}</span>
                                                    </div>
                                                    <input
                                                        type="range"
                                                        min={minProductPrice}
                                                        max={maxProductPrice}
                                                        value={priceRange[1]}
                                                        onChange={(e) => handlePriceChange(priceRange[0], parseInt(e.target.value))}
                                                        className="w-full accent-vermilion"
                                                    />
                                                </div>
                                            </div>

                                            {/* Rating - Mobile */}
                                            <div className="mb-6">
                                                <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                                                    Rating
                                                </h3>
                                                <div className="space-y-2">
                                                    {RATING_OPTIONS.map((option) => (
                                                        <button
                                                            key={option.value}
                                                            onClick={() => handleRatingChange(option.value)}
                                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${minRating === option.value
                                                                ? 'bg-vermilion text-white'
                                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                                }`}
                                                        >
                                                            {option.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => setMobileFiltersOpen(false)}
                                                className="w-full bg-vermilion text-white py-3 rounded-lg font-semibold hover:bg-vermilion-600 transition-colors"
                                            >
                                                Show {filteredProducts.length} Products
                                            </button>
                                        </div>
                                    </motion.aside>
                                </>
                            )}
                        </AnimatePresence>

                        {/* Main Content */}
                        <main className="flex-1">
                            {/* Sort Bar */}
                            <div className="bg-white dark:bg-[#1A1A1A] rounded-xl shadow-md dark:shadow-black/20 p-4 mb-6">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-600 dark:text-gray-300">
                                            Showing <strong className="text-gray-900 dark:text-white">{filteredProducts.length}</strong> products
                                        </span>
                                        {searchQuery && (
                                            <span className="text-gray-500 dark:text-gray-400">
                                                for "<span className="text-vermilion dark:text-gold">{searchQuery}</span>"
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <label className="flex items-center gap-2">
                                            <span className="text-sm text-gray-600 dark:text-gray-300">Sort by:</span>
                                            <select
                                                value={sortBy}
                                                onChange={(e) => handleSortChange(e.target.value as SortOption)}
                                                className="px-3 py-2 border dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-vermilion/50"
                                            >
                                                {SORT_OPTIONS.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>
                                    </div>
                                </div>

                                {/* Active Filters Pills */}
                                {hasActiveFilters && (
                                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t dark:border-gray-700">
                                        {selectedCategory !== 'All' && (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-vermilion/10 dark:bg-gold/10 text-vermilion dark:text-gold rounded-full text-sm">
                                                {selectedCategory}
                                                <button onClick={() => handleCategoryChange('All')} className="hover:bg-vermilion/20 dark:hover:bg-gold/20 rounded-full p-0.5">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </span>
                                        )}
                                        {minRating > 0 && (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-vermilion/10 dark:bg-gold/10 text-vermilion dark:text-gold rounded-full text-sm">
                                                {minRating}★ & Up
                                                <button onClick={() => handleRatingChange(0)} className="hover:bg-vermilion/20 dark:hover:bg-gold/20 rounded-full p-0.5">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </span>
                                        )}
                                        {(priceRange[0] > minProductPrice || priceRange[1] < maxProductPrice) && (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-vermilion/10 dark:bg-gold/10 text-vermilion dark:text-gold rounded-full text-sm">
                                                ₹{priceRange[0].toLocaleString('en-IN')} - ₹{priceRange[1].toLocaleString('en-IN')}
                                                <button onClick={() => handlePriceChange(minProductPrice, maxProductPrice)} className="hover:bg-vermilion/20 dark:hover:bg-gold/20 rounded-full p-0.5">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </span>
                                        )}
                                        {searchQuery && (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-vermilion/10 dark:bg-gold/10 text-vermilion dark:text-gold rounded-full text-sm">
                                                Search: {searchQuery}
                                                <button onClick={() => { setSearchQuery(''); updateURL({ q: undefined }); }} className="hover:bg-vermilion/20 dark:hover:bg-gold/20 rounded-full p-0.5">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Products Grid */}
                            {loadingProducts ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {[...Array(8)].map((_, idx) => (
                                        <div key={idx} className="bg-white rounded-xl shadow-md p-4 animate-pulse">
                                            <div className="h-60 bg-gray-200 rounded-lg mb-4"></div>
                                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : filteredProducts.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {filteredProducts.map((product, index) => (
                                        <motion.div
                                            key={product.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                        >
                                            <ProductCard
                                                product={product}
                                                onAddToCart={handleAddToCart}
                                                onToggleWishlist={toggleWishlist}
                                                isInWishlist={wishlist.includes(product.id)}
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                /* No Results */
                                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                                    <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                                    <p className="text-gray-600 mb-6">
                                        We couldn't find any products matching your criteria.<br />
                                        Try adjusting your filters or search terms.
                                    </p>
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-500">Suggestions:</p>
                                        <ul className="text-sm text-gray-600 space-y-1">
                                            <li>• Check for spelling errors</li>
                                            <li>• Try broader search terms</li>
                                            <li>• Remove some filters</li>
                                        </ul>
                                    </div>
                                    <button
                                        onClick={clearAllFilters}
                                        className="mt-6 bg-vermilion text-white px-6 py-2 rounded-lg hover:bg-vermilion-600 transition-colors"
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            )}
                        </main>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CollectionsPage;
