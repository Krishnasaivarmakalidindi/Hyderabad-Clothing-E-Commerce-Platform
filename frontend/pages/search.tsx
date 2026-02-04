// Search Results Page - Full search functionality with filters and sorting
// Navigates to /search?q=keyword and displays results

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import { searchProducts } from '../data/products';
import { Product, SortOption, SORT_OPTIONS, ProductCategory } from '../types/product';
import { productsAPI } from '../lib/api';

const normalizeApiProduct = (data: any): Product => {
    const price = Number(data.price) || 0;
    const mrp = Number(data.mrp) || price;
    const variants = Array.isArray(data.variants) ? data.variants : [];
    const sizes = variants.map((v: any) => v.size).filter(Boolean);
    const totalStockFromVariants = variants.reduce((sum: number, v: any) => sum + (Number(v.stock_available) || 0), 0);
    const allowedCategories: ProductCategory[] = ['Sarees', 'Kurtas', 'Lehengas', 'Fabrics', 'Mens Ethnic', 'Kids'];
    const categoryValue = (data.category || '') as ProductCategory;
    const category = allowedCategories.includes(categoryValue) ? categoryValue : 'Sarees';
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

const SearchPage: React.FC = () => {
    const router = useRouter();
    const { q: queryParam, sort: sortParam, category: categoryParam } = router.query;

    const [searchQuery, setSearchQuery] = useState<string>('');
    const [sortBy, setSortBy] = useState<SortOption>('popular');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [wishlist, setWishlist] = useState<number[]>([]);
    const [results, setResults] = useState<Product[]>([]);
    const [loadingResults, setLoadingResults] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    // Initialize from URL params
    useEffect(() => {
        if (typeof queryParam === 'string') {
            setSearchQuery(queryParam);
        }
        if (typeof sortParam === 'string' && SORT_OPTIONS.some(opt => opt.value === sortParam)) {
            setSortBy(sortParam as SortOption);
        }
        if (typeof categoryParam === 'string') {
            setSelectedCategory(categoryParam);
        }
    }, [queryParam, sortParam, categoryParam]);

    const fetchResults = useCallback(async (query: string) => {
        if (!query) {
            setResults([]);
            return;
        }

        setLoadingResults(true);
        try {
            const params: Record<string, string> = { search: query };
            if (selectedCategory !== 'All') params.category = selectedCategory;
            switch (sortBy) {
                case 'price-low-high':
                    params.sortBy = 'price';
                    params.order = 'ASC';
                    break;
                case 'price-high-low':
                    params.sortBy = 'price';
                    params.order = 'DESC';
                    break;
                case 'highest-rated':
                    params.sortBy = 'average_rating';
                    params.order = 'DESC';
                    break;
                case 'new-arrivals':
                    params.sortBy = 'created_at';
                    params.order = 'DESC';
                    break;
                default:
                    break;
            }

            const res = await productsAPI.getAll(params);
            const apiProducts = Array.isArray(res.data?.data?.products)
                ? res.data.data.products
                : Array.isArray(res.data?.data)
                    ? res.data.data
                    : [];

            if (apiProducts.length) {
                const normalized = apiProducts.map((p: any) => normalizeApiProduct(p));
                setResults(normalized);
                setApiError(null);
                return;
            }
        } catch (err) {
            console.warn('Falling back to static search results:', err);
            setApiError('Showing showroom results while live search loads.');
        }

        // Fallback to static search
        setResults(searchProducts(query));
    }, [selectedCategory, sortBy]);

    // Trigger search when inputs change
    useEffect(() => {
        if (!searchQuery) {
            setResults([]);
            return;
        }
        fetchResults(searchQuery);
    }, [searchQuery, sortBy, selectedCategory, fetchResults]);

    // Filter and sort results
    const searchResults = useMemo(() => {
        let result = [...results];

        // Apply category filter (fallback safety)
        if (selectedCategory !== 'All') {
            result = result.filter(p => p.category === selectedCategory);
        }

        // Apply sorting (ensures deterministic order even if API didn't sort)
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
    }, [results, sortBy, selectedCategory]);

    // Get categories from results for filtering
    const categoriesInResults = useMemo(() => {
        const categories = new Set(results.map(p => p.category));
        return ['All', ...Array.from(categories)];
    }, [results]);

    // Handle new search
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const input = (e.target as HTMLFormElement).querySelector('input');
        if (input) {
            const newQuery = input.value.trim();
            if (newQuery) {
                setSearchQuery(newQuery);
                router.push(`/search?q=${encodeURIComponent(newQuery)}`);
            }
        }
    };

    // Update URL with sort/filter changes
    const updateURL = useCallback((params: { sort?: string; category?: string }) => {
        const current = new URLSearchParams();
        if (searchQuery) current.set('q', searchQuery);
        if (params.sort && params.sort !== 'popular') current.set('sort', params.sort);
        if (params.category && params.category !== 'All') current.set('category', params.category);

        router.replace(`/search?${current.toString()}`, undefined, { shallow: true });
    }, [router, searchQuery]);

    const handleSortChange = (sort: SortOption) => {
        setSortBy(sort);
        updateURL({ sort, category: selectedCategory !== 'All' ? selectedCategory : undefined });
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        updateURL({ sort: sortBy !== 'popular' ? sortBy : undefined, category: category !== 'All' ? category : undefined });
    };

    const toggleWishlist = (product: Product) => {
        setWishlist(prev =>
            prev.includes(product.id)
                ? prev.filter(id => id !== product.id)
                : [...prev, product.id]
        );
    };

    const handleAddToCart = (product: Product) => {
        alert(`${product.name} added to cart!`);
    };

    // Related search suggestions
    const relatedSearches = useMemo(() => {
        if (!searchQuery) return [];
        const suggestions = ['Sarees', 'Kurtas', 'Lehengas', 'Wedding', 'Silk', 'Cotton'];
        return suggestions.filter(s =>
            !searchQuery.toLowerCase().includes(s.toLowerCase())
        ).slice(0, 4);
    }, [searchQuery]);

    return (
        <Layout>
            <Head>
                <title>{searchQuery ? `Search: ${searchQuery}` : 'Search'} - Hyderabad Clothing</title>
                <meta name="description" content={`Search results for ${searchQuery} - Find authentic Indian ethnic wear`} />
            </Head>

            <div className="min-h-screen bg-gray-50">
                {/* Search Header */}
                <div className="bg-white shadow-sm">
                    <div className="container mx-auto px-4 py-6">
                        <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto">
                            <div className="relative">
                                <input
                                    type="text"
                                    defaultValue={searchQuery}
                                    placeholder="Search products, categories, brands, materials..."
                                    className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-vermilion transition-colors"
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
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-vermilion text-white px-6 py-2 rounded-lg hover:bg-vermilion-600 transition-colors"
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
                    {searchQuery ? (
                        <>
                            {/* Results Header */}
                            <div className="mb-6">
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                    Search Results for "{searchQuery}"
                                </h1>
                                <p className="text-gray-600">
                                    {loadingResults ? 'Loading results...' : `Found ${searchResults.length} product${searchResults.length !== 1 ? 's' : ''}`}
                                </p>
                            </div>

                            {/* Filters & Sort Bar */}
                            <div className="bg-white rounded-xl shadow-md p-4 mb-6">
                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                    {/* Category Pills */}
                                    <div className="flex flex-wrap gap-2">
                                        {categoriesInResults.map((category) => (
                                            <button
                                                key={category}
                                                onClick={() => handleCategoryChange(category)}
                                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedCategory === category
                                                    ? 'bg-vermilion text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {category}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Sort Dropdown */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-600">Sort:</span>
                                        <select
                                            value={sortBy}
                                            onChange={(e) => handleSortChange(e.target.value as SortOption)}
                                            className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-vermilion/50"
                                        >
                                            {SORT_OPTIONS.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Results Grid */}
                            {loadingResults ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {[...Array(8)].map((_, idx) => (
                                        <div key={idx} className="bg-white rounded-xl shadow-md p-4 animate-pulse">
                                            <div className="h-60 bg-gray-200 rounded-lg mb-4"></div>
                                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : searchResults.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {searchResults.map((product, index) => (
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
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        No results found for "{searchQuery}"
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        We couldn't find any products matching your search.
                                    </p>

                                    {/* Suggestions */}
                                    <div className="max-w-md mx-auto text-left">
                                        <p className="text-sm font-medium text-gray-700 mb-3">Suggestions:</p>
                                        <ul className="text-sm text-gray-600 space-y-2 mb-6">
                                            <li className="flex items-start gap-2">
                                                <span className="text-vermilion">•</span>
                                                Check the spelling of your search term
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-vermilion">•</span>
                                                Try using more general words
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-vermilion">•</span>
                                                Try searching for a category like "Sarees" or "Kurtas"
                                            </li>
                                        </ul>

                                        {relatedSearches.length > 0 && (
                                            <div>
                                                <p className="text-sm font-medium text-gray-700 mb-3">Try searching for:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {relatedSearches.map((term) => (
                                                        <Link
                                                            key={term}
                                                            href={`/search?q=${encodeURIComponent(term)}`}
                                                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                                                        >
                                                            {term}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <Link
                                        href="/collections"
                                        className="inline-block mt-6 bg-vermilion text-white px-6 py-2 rounded-lg hover:bg-vermilion-600 transition-colors"
                                    >
                                        Browse All Collections
                                    </Link>
                                </div>
                            )}

                            {/* Related Searches */}
                            {searchResults.length > 0 && relatedSearches.length > 0 && (
                                <div className="mt-12 bg-white rounded-xl shadow-md p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Searches</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {relatedSearches.map((term) => (
                                            <Link
                                                key={term}
                                                href={`/search?q=${encodeURIComponent(term)}`}
                                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                                            >
                                                {term}
                                            </Link>
                                        ))}
                                        <Link
                                            href={`/search?q=${encodeURIComponent(searchQuery + ' silk')}`}
                                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                                        >
                                            {searchQuery} silk
                                        </Link>
                                        <Link
                                            href={`/search?q=${encodeURIComponent(searchQuery + ' cotton')}`}
                                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                                        >
                                            {searchQuery} cotton
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        /* No Search Query - Show Browse Options */
                        <div className="text-center py-12">
                            <div className="w-24 h-24 mx-auto mb-6 bg-vermilion/10 rounded-full flex items-center justify-center">
                                <svg className="w-12 h-12 text-vermilion" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">What are you looking for?</h2>
                            <p className="text-gray-600 mb-8">
                                Search for products by name, category, brand, or material
                            </p>

                            {/* Popular Categories */}
                            <div className="max-w-2xl mx-auto">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Categories</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {['Sarees', 'Kurtas', 'Lehengas', 'Mens Ethnic', 'Kids', 'Fabrics'].map((category) => (
                                        <Link
                                            key={category}
                                            href={`/collections?category=${encodeURIComponent(category)}`}
                                            className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow text-center"
                                        >
                                            <span className="text-3xl mb-2 block">
                                                {category === 'Sarees' && '🥻'}
                                                {category === 'Kurtas' && '👘'}
                                                {category === 'Lehengas' && '👗'}
                                                {category === 'Mens Ethnic' && '👔'}
                                                {category === 'Kids' && '👶'}
                                                {category === 'Fabrics' && '🧵'}
                                            </span>
                                            <span className="font-medium text-gray-900">{category}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Popular Searches */}
                            <div className="mt-12">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Searches</h3>
                                <div className="flex flex-wrap justify-center gap-3">
                                    {['Banarasi Saree', 'Silk Kurta', 'Bridal Lehenga', 'Kids Ethnic', 'Cotton Fabric', 'Mens Pathani'].map((term) => (
                                        <Link
                                            key={term}
                                            href={`/search?q=${encodeURIComponent(term)}`}
                                            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-full hover:border-vermilion hover:text-vermilion transition-colors"
                                        >
                                            {term}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default SearchPage;
