import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter, FaStar, FaHeart, FaShoppingCart, FaEye } from 'react-icons/fa';
import Layout from '../components/Layout';
import api from '../lib/api';

interface Product {
    id: string;
    name_en: string;
    name_te: string;
    price: number;
    mrp: number;
    category: string;
    seller_name: string;
    average_rating: number;
    total_reviews: number;
    images: string[];
    stock_status?: string;
    sizes?: string[];
    variants?: any[];
}

export default function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [priceRange, setPriceRange] = useState([0, 10000]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('popular');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, [selectedCategory, sortBy]);

    const fetchProducts = async () => {
        try {
            setLoading(true);

            // Build query params
            const params: any = {};
            if (selectedCategory) params.category = selectedCategory;
            if (searchTerm) params.search = searchTerm;
            if (sortBy === 'price_low') {
                params.sortBy = 'price';
                params.order = 'ASC';
            } else if (sortBy === 'price_high') {
                params.sortBy = 'price';
                params.order = 'DESC';
            } else if (sortBy === 'newest') {
                params.sortBy = 'created_at';
                params.order = 'DESC';
            }

            const res = await api.get('/products', { params });

            if (res.data.success) {
                const fetchedProducts = res.data.data.products.map((p: any) => ({
                    ...p,
                    price: parseFloat(p.price),
                    mrp: parseFloat(p.mrp),
                    average_rating: parseFloat(p.average_rating || '0'),
                    sizes: p.variants ? p.variants.map((v: any) => v.size) : []
                }));
                setProducts(fetchedProducts);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const categories = ['Sarees', 'Kurtas', 'Lehengas', 'Fabrics', 'Mens Ethnic', 'Kids'];
    const sortOptions = [
        { value: 'popular', label: 'Most Popular' },
        { value: 'newest', label: 'New Arrivals' },
        { value: 'price_low', label: 'Price: Low to High' },
        { value: 'price_high', label: 'Price: High to Low' },
        { value: 'rating', label: 'Top Rated' },
    ];

    return (
        <Layout title="Shop Collections - Hyderabad Clothing">
            <div className="bg-cream-50 dark:bg-[#121212] min-h-screen pb-20">
                {/* Header / Breadcrumbs */}
                <div className="bg-white dark:bg-[#1A1A1A] border-b border-cream-200 dark:border-gray-800 py-8">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="flex items-center text-xs font-bold text-brown-400 dark:text-gray-500 mb-4 uppercase tracking-wider">
                            <Link href="/" className="hover:text-vermilion transition-colors">Home</Link>
                            <span className="mx-2">/</span>
                            <span className="text-brown-900 dark:text-white">Collections</span>
                        </div>
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-black text-brown-900 dark:text-white mb-2">Shop Collections</h1>
                                <p className="text-brown-500 dark:text-gray-400">Discover Hyderabad's finest ethnic wear directly from makers.</p>
                            </div>
                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <div className="relative flex-1 md:w-80 group">
                                    <input
                                        type="text"
                                        placeholder="Search for sarees, kurtas..."
                                        className="w-full pl-12 pr-4 py-3 bg-cream-50 dark:bg-[#242424] border-transparent dark:border-gray-700 rounded-xl focus:bg-white dark:focus:bg-[#2A2A2A] focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all font-medium text-brown-900 dark:text-white placeholder-brown-400 dark:placeholder-gray-500"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && fetchProducts()}
                                    />
                                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-brown-400 dark:text-gray-500 group-focus-within:text-vermilion transition-colors" />
                                </div>
                                <button
                                    className="md:hidden p-3 bg-white dark:bg-[#242424] border border-cream-200 dark:border-gray-700 rounded-xl text-brown-600 dark:text-gray-300 hover:bg-cream-50 dark:hover:bg-gray-700"
                                    onClick={() => setShowFilters(!showFilters)}
                                >
                                    <FaFilter />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 md:px-6 py-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar Filters */}
                        <aside className={`lg:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                            <div className="bg-white dark:bg-[#1A1A1A] p-6 rounded-2xl shadow-sm dark:shadow-black/20 sticky top-24 space-y-8 border border-cream-100 dark:border-gray-800">
                                <div>
                                    <h3 className="font-black text-brown-900 dark:text-white mb-4 text-lg">Categories</h3>
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedCategory === '' ? 'border-vermilion' : 'border-brown-300 dark:border-gray-600 group-hover:border-vermilion'}`}>
                                                {selectedCategory === '' && <div className="w-2.5 h-2.5 rounded-full bg-vermilion" />}
                                            </div>
                                            <input
                                                type="radio"
                                                name="category"
                                                checked={selectedCategory === ''}
                                                onChange={() => setSelectedCategory('')}
                                                className="hidden"
                                            />
                                            <span className={`text-sm transition-colors ${selectedCategory === '' ? 'text-brown-900 dark:text-white font-bold' : 'text-brown-600 dark:text-gray-400 group-hover:text-brown-900 dark:group-hover:text-white'}`}>All Products</span>
                                        </label>
                                        {categories.map(cat => (
                                            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedCategory === cat.toLowerCase() ? 'border-vermilion' : 'border-brown-300 dark:border-gray-600 group-hover:border-vermilion'}`}>
                                                    {selectedCategory === cat.toLowerCase() && <div className="w-2.5 h-2.5 rounded-full bg-vermilion" />}
                                                </div>
                                                <input
                                                    type="radio"
                                                    name="category"
                                                    checked={selectedCategory === cat.toLowerCase()}
                                                    onChange={() => setSelectedCategory(cat.toLowerCase())}
                                                    className="hidden"
                                                />
                                                <span className={`text-sm transition-colors ${selectedCategory === cat.toLowerCase() ? 'text-brown-900 dark:text-white font-bold' : 'text-brown-600 dark:text-gray-400 group-hover:text-brown-900 dark:group-hover:text-white'}`}>{cat}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-black text-brown-900 dark:text-white mb-4 text-lg">Price Range</h3>
                                    <input
                                        type="range"
                                        min="0"
                                        max="10000"
                                        step="100"
                                        className="w-full accent-vermilion h-2 bg-cream-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                        onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                                    />
                                    <div className="flex justify-between text-xs font-bold text-brown-500 dark:text-gray-400 mt-2">
                                        <span>₹0</span>
                                        <span>₹{priceRange[1].toLocaleString()}+</span>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-black text-brown-900 dark:text-white mb-4 text-lg">Rating</h3>
                                    {[4, 3, 2, 1].map(rating => (
                                        <label key={rating} className="flex items-center gap-3 mb-3 cursor-pointer group">
                                            <input type="checkbox" className="w-5 h-5 rounded border-brown-300 dark:border-gray-600 text-vermilion focus:ring-vermilion bg-white dark:bg-gray-800" />
                                            <div className="flex text-gold text-sm">
                                                {[...Array(5)].map((_, i) => (
                                                    <FaStar key={i} className={i < rating ? 'text-gold' : 'text-cream-300 dark:text-gray-600'} />
                                                ))}
                                            </div>
                                            <span className="text-xs font-bold text-brown-400 dark:text-gray-500 group-hover:text-brown-600 dark:group-hover:text-gray-300">& Up</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </aside>

                        {/* Product Grid */}
                        <div className="flex-1">
                            {/* Toolbar */}
                            <div className="flex justify-between items-center mb-6">
                                <p className="text-brown-500 dark:text-gray-400">Showing {products.length} results</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-brown-600 dark:text-gray-400 text-sm hidden sm:inline">Sort by:</span>
                                    <select
                                        className="border-brown-300 dark:border-gray-700 rounded-lg text-sm focus:ring-vermilion focus:border-vermilion bg-white dark:bg-[#1A1A1A] text-brown-900 dark:text-white"
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                    >
                                        {sortOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {loading ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="bg-white dark:bg-[#1A1A1A] rounded-xl p-4 shadow-sm animate-pulse">
                                            <div className="bg-cream-200 dark:bg-gray-700 h-64 rounded-lg mb-4"></div>
                                            <div className="h-4 bg-cream-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                                            <div className="h-4 bg-cream-200 dark:bg-gray-700 rounded w-1/2"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : products.length === 0 ? (
                                <div className="text-center py-20">
                                    <h3 className="text-xl font-bold text-brown-900 dark:text-white mb-2">No products found</h3>
                                    <p className="text-brown-500 dark:text-gray-400">Try adjusting your filters or search terms.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {products.map((product) => (
                                        <motion.div
                                            key={product.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="group bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-sm dark:shadow-black/20 hover:shadow-xl dark:hover:shadow-black/30 transition-all duration-300 overflow-hidden border border-cream-100 dark:border-gray-800"
                                        >
                                            <div className="relative aspect-[4/5] overflow-hidden bg-cream-100 dark:bg-gray-800">
                                                {product.images && product.images.length > 0 ? (
                                                    <img
                                                        src={product.images[0]}
                                                        alt={product.name_en}
                                                        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-brown-400 dark:text-gray-500">No Image</div>
                                                )}

                                                {/* Badges */}
                                                <div className="absolute top-3 left-3 flex flex-col gap-2">
                                                    {product.mrp > product.price && (
                                                        <span className="bg-vermilion text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm tracking-wider uppercase">
                                                            {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                                                        </span>
                                                    )}
                                                    {product.stock_status === 'Low Stock' && (
                                                        <span className="bg-gold text-gray-900 text-[10px] font-bold px-2 py-1 rounded-md shadow-sm tracking-wider uppercase">
                                                            Low Stock
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Quick Actions */}
                                                <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                                                    <button className="w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md hover:bg-vermilion/10 text-brown-600 dark:text-gray-300 hover:text-vermilion transition-colors">
                                                        <FaHeart size={14} />
                                                    </button>
                                                    <button className="w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md hover:bg-vermilion/10 text-brown-600 dark:text-gray-300 hover:text-vermilion transition-colors">
                                                        <FaEye size={14} />
                                                    </button>
                                                </div>

                                                {/* Add to Cart Overlay */}
                                                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                                    <Link href={`/products/${product.id}`} className="w-full bg-white/95 dark:bg-gray-800/95 backdrop-blur hover:bg-vermilion hover:text-white text-brown-900 dark:text-white font-bold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm">
                                                        <FaShoppingCart size={14} /> View Details
                                                    </Link>
                                                </div>
                                            </div>

                                            <div className="p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <p className="text-[10px] font-bold text-brown-400 dark:text-gray-500 uppercase tracking-wider">{product.category}</p>
                                                    <div className="flex items-center gap-1 text-[10px] font-bold text-brown-700 dark:text-gray-300 bg-cream-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                                                        <FaStar className="text-gold" size={10} /> {product.average_rating}
                                                    </div>
                                                </div>

                                                <Link href={`/products/${product.id}`}>
                                                    <h3 className="font-bold text-brown-900 dark:text-white mb-1 truncate hover:text-vermilion transition-colors text-base">{product.name_en}</h3>
                                                </Link>
                                                <p className="text-xs text-brown-500 dark:text-gray-400 mb-2 truncate">{product.seller_name}</p>

                                                {/* Sizes */}
                                                {product.sizes && product.sizes.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mb-3">
                                                        {product.sizes.slice(0, 4).map((size, idx) => (
                                                            <span key={idx} className="text-[10px] font-semibold text-brown-600 dark:text-gray-400 bg-cream-100 dark:bg-gray-800 px-1.5 py-0.5 rounded border border-cream-200 dark:border-gray-700">
                                                                {size}
                                                            </span>
                                                        ))}
                                                        {product.sizes.length > 4 && (
                                                            <span className="text-[10px] text-brown-400 dark:text-gray-500 flex items-center">+{product.sizes.length - 4}</span>
                                                        )}
                                                    </div>
                                                )}

                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-lg font-black text-brown-900 dark:text-white">₹{product.price.toLocaleString()}</span>
                                                    {product.mrp > product.price && (
                                                        <span className="text-xs text-brown-400 dark:text-gray-500 line-through">₹{product.mrp.toLocaleString()}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
