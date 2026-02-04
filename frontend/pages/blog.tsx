import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, Tag, User } from 'lucide-react';
import Layout from '../components/Layout';

export default function Blog() {
    const featuredPost = {
        id: 1,
        title: "The Art of Banarasi Silk: A Timeless Tradition",
        excerpt: "Discover the centuries-old craftsmanship behind Banarasi silk sarees and why they remain the epitome of Indian wedding fashion.",
        author: "Priya Sharma",
        date: "January 28, 2026",
        readTime: "8 min read",
        category: "Craftsmanship",
        image: null
    };

    const posts = [
        {
            id: 2,
            title: "Styling Tips: Pairing Jewelry with Ethnic Wear",
            excerpt: "Learn how to choose the perfect jewelry pieces to complement your sarees and lehengas for any occasion.",
            author: "Anjali Reddy",
            date: "January 20, 2026",
            readTime: "5 min read",
            category: "Style Guide"
        },
        {
            id: 3,
            title: "Sustainable Fashion: Our Commitment to Eco-Friendly Practices",
            excerpt: "How Hyderabad Clothing is working with artisans to create beautiful fashion while protecting the environment.",
            author: "Rahul Verma",
            date: "January 15, 2026",
            readTime: "6 min read",
            category: "Sustainability"
        },
        {
            id: 4,
            title: "Wedding Season 2026: Top Trends in Bridal Wear",
            excerpt: "From traditional reds to contemporary pastels, explore the hottest bridal fashion trends for the upcoming wedding season.",
            author: "Priya Sharma",
            date: "January 10, 2026",
            readTime: "7 min read",
            category: "Trends"
        },
        {
            id: 5,
            title: "The Story Behind Pochampally Ikat",
            excerpt: "Explore the unique tie-dye technique that gives Pochampally sarees their distinctive geometric patterns.",
            author: "Deepa Krishnan",
            date: "January 5, 2026",
            readTime: "6 min read",
            category: "Craftsmanship"
        },
        {
            id: 6,
            title: "How to Care for Your Silk Sarees",
            excerpt: "Expert tips on storing, cleaning, and maintaining your precious silk sarees to keep them looking new for years.",
            author: "Anjali Reddy",
            date: "December 28, 2025",
            readTime: "4 min read",
            category: "Care Guide"
        },
        {
            id: 7,
            title: "Festival Fashion: Diwali Collection Preview",
            excerpt: "Get a sneak peek at our exclusive Diwali collection featuring vibrant colors and intricate embroidery.",
            author: "Rahul Verma",
            date: "December 20, 2025",
            readTime: "5 min read",
            category: "Collections"
        }
    ];

    const categories = [
        "All Posts",
        "Craftsmanship",
        "Style Guide",
        "Trends",
        "Sustainability",
        "Care Guide",
        "Collections"
    ];

    return (
        <Layout>
            <Head>
                <title>Blog | Hyderabad Clothing</title>
                <meta name="description" content="Explore fashion tips, styling guides, and stories about Indian ethnic wear and craftsmanship." />
            </Head>

            {/* Hero Section */}
            <section className="bg-cream-50 py-16 md:py-24">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-3xl mx-auto text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-black text-brown-900 mb-6"
                        >
                            Our Blog
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-lg text-brown-600 leading-relaxed"
                        >
                            Stories of craftsmanship, style inspiration, and the rich heritage of Indian ethnic fashion.
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-6 bg-white border-b border-cream-200 sticky top-0 z-10">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {categories.map((category, index) => (
                            <button
                                key={index}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                                    index === 0
                                        ? 'bg-brown-900 text-cream-50'
                                        : 'bg-cream-100 text-brown-600 hover:bg-cream-200'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Post */}
            <section className="py-12 bg-white">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-5xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-cream-50 rounded-3xl overflow-hidden border border-cream-200 hover:shadow-xl transition-shadow"
                        >
                            <div className="grid md:grid-cols-2">
                                <div className="h-64 md:h-auto bg-brown-200 flex items-center justify-center">
                                    <div className="text-center text-brown-400">
                                        <Tag className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                        <span className="font-medium">Featured Image</span>
                                    </div>
                                </div>
                                <div className="p-8 md:p-10 flex flex-col justify-center">
                                    <span className="inline-block bg-accent-gold/20 text-accent-gold px-3 py-1 rounded-full text-sm font-medium mb-4 w-fit">
                                        Featured
                                    </span>
                                    <h2 className="text-2xl md:text-3xl font-bold text-brown-900 mb-4 hover:text-vermilion transition-colors cursor-pointer">
                                        {featuredPost.title}
                                    </h2>
                                    <p className="text-brown-600 mb-6 leading-relaxed">
                                        {featuredPost.excerpt}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-brown-500 mb-6">
                                        <span className="flex items-center gap-1">
                                            <User className="w-4 h-4" />
                                            {featuredPost.author}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {featuredPost.date}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {featuredPost.readTime}
                                        </span>
                                    </div>
                                    <button className="flex items-center gap-2 text-brown-900 font-semibold hover:text-vermilion transition-colors w-fit">
                                        Read Article
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Blog Posts Grid */}
            <section className="py-12 bg-cream-50">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-2xl font-bold text-brown-900 mb-8">Latest Articles</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {posts.map((post, index) => (
                                <motion.article
                                    key={post.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    viewport={{ once: true }}
                                    className="bg-white rounded-2xl overflow-hidden border border-cream-200 hover:shadow-lg transition-all group"
                                >
                                    <div className="h-48 bg-cream-100 flex items-center justify-center">
                                        <div className="text-center text-brown-300">
                                            <Tag className="w-8 h-8 mx-auto mb-1 opacity-50" />
                                            <span className="text-sm">Image</span>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <span className="inline-block bg-cream-100 text-brown-600 px-3 py-1 rounded-full text-xs font-medium mb-3">
                                            {post.category}
                                        </span>
                                        <h3 className="text-lg font-bold text-brown-900 mb-2 group-hover:text-vermilion transition-colors cursor-pointer line-clamp-2">
                                            {post.title}
                                        </h3>
                                        <p className="text-brown-600 text-sm mb-4 line-clamp-2">
                                            {post.excerpt}
                                        </p>
                                        <div className="flex items-center justify-between text-xs text-brown-500">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {post.date}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {post.readTime}
                                            </span>
                                        </div>
                                    </div>
                                </motion.article>
                            ))}
                        </div>

                        {/* Load More */}
                        <div className="text-center mt-12">
                            <button className="bg-brown-900 text-cream-50 px-8 py-3 rounded-full font-semibold hover:bg-brown-800 transition-colors">
                                Load More Articles
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="py-16 bg-brown-900 text-cream-50">
                <div className="container mx-auto px-4 md:px-6 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">Stay Updated</h2>
                    <p className="text-cream-200 mb-8 max-w-2xl mx-auto">
                        Subscribe to our newsletter for the latest fashion tips, new arrivals, and exclusive offers.
                    </p>
                    <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-6 py-3 rounded-full bg-brown-800 border border-brown-700 text-cream-50 placeholder-brown-400 focus:outline-none focus:border-accent-gold"
                        />
                        <button
                            type="submit"
                            className="bg-accent-gold text-brown-900 px-8 py-3 rounded-full font-semibold hover:bg-accent-gold/90 transition-colors whitespace-nowrap"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </section>
        </Layout>
    );
}
