import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaUser, FaShoppingBag, FaBars, FaTimes,
    FaChevronDown, FaHeart, FaQuestionCircle, FaSignOutAlt, FaBox
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import AnimatedThemeToggle from './AnimatedThemeToggle';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { isLoggedIn, user, logout } = useAuth();
    const { cart } = useCart();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <nav
                className={`fixed w-full z-50 transition-all duration-500 ${isScrolled
                    ? 'bg-[#121212]/98 backdrop-blur-md shadow-xl py-2'
                    : 'bg-[#121212]/95 backdrop-blur-sm py-4'
                }`}
            >
                <div className="container mx-auto px-4 md:px-8">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center text-gray-900 font-bold text-2xl shadow-lg shadow-amber-500/20 group-hover:scale-105 group-hover:shadow-amber-500/30 transition-all duration-300">
                                H
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-xl tracking-tight text-white leading-tight">
                                    Hyderabad<span className="text-amber-400">Clothing</span>
                                </span>
                                <span className="text-[10px] text-gray-400 tracking-widest uppercase hidden sm:block">Premium Ethnic Wear</span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center space-x-1">
                            <Link href="/" className="px-4 py-2 font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200">
                                Home
                            </Link>
                            <div className="relative group">
                                <Link href="/collections" className="flex items-center gap-1.5 px-4 py-2 font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200">
                                    Collections <FaChevronDown size={10} className="group-hover:rotate-180 transition-transform duration-300" />
                                </Link>
                                {/* Mega Menu Dropdown */}
                                <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                    <div className="w-72 bg-[#1A1A1A] shadow-2xl rounded-2xl p-3 border border-gray-800">
                                        <div className="flex flex-col gap-1">
                                            <Link href="/collections" className="p-3 hover:bg-amber-500/10 rounded-xl text-gray-200 hover:text-amber-400 font-semibold transition-all duration-200 flex items-center gap-3">
                                                <span className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center text-amber-400 text-sm">All</span>
                                                All Products
                                            </Link>
                                            <div className="h-px bg-gray-800 my-1"></div>
                                            <Link href="/collections?category=Sarees" className="p-3 hover:bg-amber-500/10 rounded-xl text-gray-400 hover:text-amber-400 transition-all duration-200">Sarees</Link>
                                            <Link href="/collections?category=Kurtas" className="p-3 hover:bg-amber-500/10 rounded-xl text-gray-400 hover:text-amber-400 transition-all duration-200">Kurtas</Link>
                                            <Link href="/collections?category=Lehengas" className="p-3 hover:bg-amber-500/10 rounded-xl text-gray-400 hover:text-amber-400 transition-all duration-200">Lehengas</Link>
                                            <Link href="/collections?category=Fabrics" className="p-3 hover:bg-amber-500/10 rounded-xl text-gray-400 hover:text-amber-400 transition-all duration-200">Fabrics</Link>
                                            <Link href="/collections?category=Mens%20Ethnic" className="p-3 hover:bg-amber-500/10 rounded-xl text-gray-400 hover:text-amber-400 transition-all duration-200">Men's Ethnic</Link>
                                            <Link href="/collections?category=Kids" className="p-3 hover:bg-amber-500/10 rounded-xl text-gray-400 hover:text-amber-400 transition-all duration-200">Kids</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Link href="/collections?sort=new-arrivals" className="px-4 py-2 font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200">
                                New Arrivals
                            </Link>
                            <Link href="/our-story" className="px-4 py-2 font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200">
                                Our Story
                            </Link>
                        </div>

                        {/* Action Icons */}
                        <div className="flex items-center gap-2 md:gap-3">
                            {/* Theme Toggle */}
                            <div className="hidden md:flex items-center justify-center">
                                <AnimatedThemeToggle />
                            </div>
                            {/* Wishlist */}
                            <Link href="/wishlist" className="hidden md:flex items-center justify-center w-10 h-10 text-gray-400 hover:text-amber-400 hover:bg-white/5 rounded-xl transition-all duration-200 relative group">
                                <FaHeart size={18} className="group-hover:scale-110 transition-transform duration-200" />
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-gray-900 text-[10px] rounded-full flex items-center justify-center font-bold shadow-lg shadow-amber-500/30">0</span>
                            </Link>

                            {/* Cart */}
                            <Link href="/cart" className="flex items-center justify-center w-10 h-10 text-gray-400 hover:text-amber-400 hover:bg-white/5 rounded-xl transition-all duration-200 relative group haptic-click">
                                <FaShoppingBag size={18} className="group-hover:scale-110 transition-transform duration-200" />
                                {cart.itemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-gray-900 text-[10px] rounded-full flex items-center justify-center font-bold shadow-lg shadow-amber-500/30 animate-pulse">
                                        {cart.itemCount > 99 ? '99+' : cart.itemCount}
                                    </span>
                                )}
                            </Link>

                            {/* Divider */}
                            <div className="hidden md:flex items-center h-10 mx-1">
                                <div className="w-px h-6 bg-gray-700"></div>
                            </div>

                            {/* User Profile */}
                            <div className="relative hidden md:flex items-center">
                                {isLoggedIn ? (
                                    <div className="relative" onMouseEnter={() => setIsProfileOpen(true)} onMouseLeave={() => setIsProfileOpen(false)}>
                                        <button className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200">
                                            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-gray-900 font-semibold text-sm shadow-lg shadow-amber-500/20">
                                                {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                                            </div>
                                            <span className="max-w-[80px] truncate font-medium text-sm">{user?.fullName?.split(' ')[0]}</span>
                                            <FaChevronDown size={10} className={`transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                        {/* Profile Dropdown */}
                                        <div className={`absolute top-full right-0 pt-2 transition-all duration-200 ${isProfileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                                            <div className="w-56 bg-[#1A1A1A] shadow-2xl rounded-2xl p-3 border border-gray-800">
                                                <div className="px-3 py-2 mb-2 border-b border-gray-800">
                                                    <p className="font-semibold text-white">{user?.fullName}</p>
                                                    <p className="text-xs text-gray-500">{user?.email}</p>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <Link href="/profile" className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl text-gray-400 hover:text-amber-400 transition-all duration-200">
                                                        <FaUser size={14} /> My Profile
                                                    </Link>
                                                    <Link href="/profile?tab=orders" className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl text-gray-400 hover:text-amber-400 transition-all duration-200">
                                                        <FaBox size={14} /> My Orders
                                                    </Link>
                                                    <Link href="/wishlist" className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl text-gray-400 hover:text-amber-400 transition-all duration-200">
                                                        <FaHeart size={14} /> Wishlist
                                                    </Link>
                                                    <div className="h-px bg-gray-800 my-1"></div>
                                                    <button onClick={logout} className="flex items-center gap-3 p-3 hover:bg-red-500/10 rounded-xl text-red-400 hover:text-red-300 transition-all duration-200 w-full text-left">
                                                        <FaSignOutAlt size={14} /> Logout
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <Link href="/auth/login" className="flex items-center justify-center gap-2 px-5 py-2 h-10 bg-gradient-to-r from-amber-400 to-amber-500 text-gray-900 font-semibold rounded-xl hover:from-amber-500 hover:to-amber-600 hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-200 haptic-click">
                                        <FaUser size={14} />
                                        <span className="text-sm">Login</span>
                                    </Link>
                                )}
                            </div>

                            {/* Mobile Menu Button */}
                            <button
                                className="lg:hidden flex items-center justify-center w-10 h-10 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200 haptic-click"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                {isMobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ type: 'tween', duration: 0.2 }}
                            className="fixed inset-0 bg-[#121212] z-50 lg:hidden overflow-y-auto"
                        >
                            {/* Mobile Header */}
                            <div className="flex items-center justify-between p-4 border-b border-gray-800">
                                <Link href="/" className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
                                    <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center text-gray-900 font-bold text-2xl">
                                        H
                                    </div>
                                    <span className="font-bold text-xl text-white">
                                        Hyderabad<span className="text-amber-400">Clothing</span>
                                    </span>
                                </Link>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 rounded-xl"
                                >
                                    <FaTimes size={24} />
                                </button>
                            </div>

                            {/* Mobile Navigation */}
                            <div className="p-6">
                                <div className="flex flex-col space-y-2">
                                    <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-4 text-gray-200 font-medium text-lg hover:bg-white/5 hover:text-amber-400 rounded-xl transition-all duration-200">
                                        Home
                                    </Link>
                                    <Link href="/collections" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-4 text-gray-200 font-medium text-lg hover:bg-white/5 hover:text-amber-400 rounded-xl transition-all duration-200">
                                        Collections
                                    </Link>
                                    <Link href="/collections?sort=new-arrivals" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-4 text-gray-200 font-medium text-lg hover:bg-white/5 hover:text-amber-400 rounded-xl transition-all duration-200">
                                        New Arrivals
                                    </Link>
                                    <Link href="/our-story" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-4 text-gray-200 font-medium text-lg hover:bg-white/5 hover:text-amber-400 rounded-xl transition-all duration-200">
                                        Our Story
                                    </Link>
                                </div>

                                <div className="h-px bg-gray-800 my-6"></div>

                                {/* User Section */}
                                <div className="flex flex-col space-y-2">
                                    {isLoggedIn ? (
                                        <>
                                            <div className="flex items-center gap-3 p-4 mb-2">
                                                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-gray-900 font-bold text-lg">
                                                    {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                                                </div>
                                                <div>
                                                    <p className="text-white font-semibold">{user?.fullName}</p>
                                                    <p className="text-gray-500 text-sm">{user?.email}</p>
                                                </div>
                                            </div>
                                            <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-4 text-gray-400 hover:bg-white/5 hover:text-amber-400 rounded-xl transition-all duration-200">
                                                <FaUser size={18} /> My Profile
                                            </Link>
                                            <Link href="/profile?tab=orders" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-4 text-gray-400 hover:bg-white/5 hover:text-amber-400 rounded-xl transition-all duration-200">
                                                <FaBox size={18} /> My Orders
                                            </Link>
                                            <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-4 text-gray-400 hover:bg-white/5 hover:text-amber-400 rounded-xl transition-all duration-200">
                                                <FaHeart size={18} /> Wishlist
                                            </Link>
                                            <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 p-4 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all duration-200 text-left">
                                                <FaSignOutAlt size={18} /> Logout
                                            </button>
                                        </>
                                    ) : (
                                        <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-amber-400 to-amber-500 text-gray-900 font-semibold rounded-xl hover:from-amber-500 hover:to-amber-600 transition-all duration-200 haptic-click">
                                            <FaUser size={18} /> Login / Register
                                        </Link>
                                    )}
                                </div>

                                <div className="h-px bg-gray-800 my-6"></div>

                                {/* Theme Toggle for Mobile */}
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                                    <span className="text-gray-300 font-medium">Dark Mode</span>
                                    <AnimatedThemeToggle />
                                </div>

                                <div className="h-px bg-gray-800 my-6"></div>

                                <Link href="/help" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-4 text-gray-400 hover:bg-white/5 hover:text-amber-400 rounded-xl transition-all duration-200">
                                    <FaQuestionCircle size={18} /> Help & Support
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
            {/* Spacer for fixed navbar */}
            <div className={`transition-all duration-500 ${isScrolled ? 'h-16' : 'h-20'}`}></div>
        </>
    );
};

export default Navbar;
