import React from 'react';
import Link from 'next/link';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaCreditCard, FaGooglePay, FaApplePay } from 'react-icons/fa';
import { ShieldCheck, Truck, RotateCcw, Mail, Phone, MapPin, Sparkles } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#121212] dark:bg-[#0D0D0D] text-white pt-20 pb-8 relative overflow-hidden section-transition-dark" role="contentinfo">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23B59410' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }} />
            </div>

            <div className="container mx-auto px-4 md:px-8 relative z-10">
                {/* Trust Reassurance Bar */}
                <div className="flex flex-wrap justify-center gap-8 md:gap-16 mb-16 pb-12 border-b border-white/10">
                    <div className="flex items-center gap-4 text-gray-300">
                        <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center">
                            <ShieldCheck size={26} strokeWidth={1.5} className="text-gold" />
                        </div>
                        <div>
                            <span className="font-semibold block text-white">Secure Payments</span>
                            <span className="text-sm text-gray-400">256-bit SSL encryption</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-gray-300">
                        <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center">
                            <Truck size={26} strokeWidth={1.5} className="text-gold" />
                        </div>
                        <div>
                            <span className="font-semibold block text-white">Global Express</span>
                            <span className="text-sm text-gray-400">Worldwide delivery</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-gray-300">
                        <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center">
                            <RotateCcw size={26} strokeWidth={1.5} className="text-gold" />
                        </div>
                        <div>
                            <span className="font-semibold block text-white">Easy Returns</span>
                            <span className="text-sm text-gray-400">14-day hassle-free</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-14 h-14 bg-gradient-to-br from-gold to-gold-600 rounded-2xl flex items-center justify-center text-gray-900 font-bold text-2xl shadow-lg shadow-gold/20">
                                H
                            </div>
                            <div>
                                <span className="font-serif font-bold text-2xl tracking-tight text-white block">
                                    Hyderabad<span className="text-gold">Clothing</span>
                                </span>
                                <span className="text-xs text-gray-400 tracking-widest uppercase flex items-center gap-1">
                                    <Sparkles size={10} className="text-gold" />
                                    Luxury Ethnic Wear Boutique
                                </span>
                            </div>
                        </div>
                        <p className="text-gray-400 mb-6 leading-relaxed max-w-md">
                            Heritage reimagined. Curated by master artisans from Hyderabad,
                            our handwoven silks and ethnic wear bring timeless elegance to your wardrobe.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-3 mb-6">
                            <a href="tel:+919876543210" className="flex items-center gap-3 text-gray-400 hover:text-gold transition-colors" aria-label="Call us">
                                <Phone size={18} />
                                <span>+91 98765 43210</span>
                            </a>
                            <a href="mailto:hello@hyderabadclothing.com" className="flex items-center gap-3 text-gray-400 hover:text-gold transition-colors" aria-label="Email us">
                                <Mail size={18} />
                                <span>hello@hyderabadclothing.com</span>
                            </a>
                            <div className="flex items-start gap-3 text-gray-400">
                                <MapPin size={18} className="mt-0.5" />
                                <span>Begumpet, Hyderabad, Telangana 500016</span>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="flex gap-3">
                            <a href="#" className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center hover:bg-gold hover:text-gray-900 transition-all duration-300 haptic-click" aria-label="Follow us on Instagram">
                                <FaInstagram size={20} />
                            </a>
                            <a href="#" className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center hover:bg-gold hover:text-gray-900 transition-all duration-300 haptic-click" aria-label="Follow us on Facebook">
                                <FaFacebook size={20} />
                            </a>
                            <a href="#" className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center hover:bg-gold hover:text-gray-900 transition-all duration-300 haptic-click" aria-label="Follow us on Twitter">
                                <FaTwitter size={20} />
                            </a>
                            <a href="#" className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center hover:bg-gold hover:text-gray-900 transition-all duration-300 haptic-click" aria-label="Subscribe on YouTube">
                                <FaYoutube size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div>
                        <h3 className="font-serif text-lg font-bold mb-6 text-gold">Shop</h3>
                        <nav aria-label="Shop navigation">
                            <ul className="space-y-4 text-gray-400">
                                <li><Link href="/collections?category=Sarees" className="hover:text-gold transition-colors inline-block">Silk Sarees</Link></li>
                                <li><Link href="/collections?category=Kurtas" className="hover:text-gold transition-colors inline-block">Kurtas & Kurtis</Link></li>
                                <li><Link href="/collections?category=Lehengas" className="hover:text-gold transition-colors inline-block">Bridal Lehengas</Link></li>
                                <li><Link href="/collections?category=Fabrics" className="hover:text-gold transition-colors inline-block">Dress Materials</Link></li>
                                <li><Link href="/collections?sort=new-arrivals" className="hover:text-gold transition-colors inline-block">New Arrivals</Link></li>
                                <li><Link href="/collections?tag=bestseller" className="hover:text-gold transition-colors inline-block">Best Sellers</Link></li>
                            </ul>
                        </nav>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h3 className="font-serif text-lg font-bold mb-6 text-gold">Support</h3>
                        <nav aria-label="Support navigation">
                            <ul className="space-y-4 text-gray-400">
                                <li><Link href="/track-order" className="hover:text-gold transition-colors inline-block">Track Order</Link></li>
                                <li><Link href="/returns" className="hover:text-gold transition-colors inline-block">Returns & Exchanges</Link></li>
                                <li><Link href="/shipping" className="hover:text-gold transition-colors inline-block">Shipping Policy</Link></li>
                                <li><Link href="/size-guide" className="hover:text-gold transition-colors inline-block">Size Guide</Link></li>
                                <li><Link href="/care-guide" className="hover:text-gold transition-colors inline-block">Fabric Care</Link></li>
                                <li><Link href="/contact" className="hover:text-gold transition-colors inline-block">Contact Us</Link></li>
                            </ul>
                        </nav>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="font-serif text-lg font-bold mb-6 text-gold">Company</h3>
                        <nav aria-label="Company navigation">
                            <ul className="space-y-4 text-gray-400">
                                <li><Link href="/our-story" className="hover:text-gold transition-colors inline-block">Our Heritage</Link></li>
                                <li><Link href="/artisans" className="hover:text-gold transition-colors inline-block">Our Artisans</Link></li>
                                <li><Link href="/sustainability" className="hover:text-gold transition-colors inline-block">Sustainability</Link></li>
                                <li><Link href="/blog" className="hover:text-gold transition-colors inline-block">Style Journal</Link></li>
                                <li><Link href="/press" className="hover:text-gold transition-colors inline-block">Press</Link></li>
                                <li><Link href="/careers" className="hover:text-gold transition-colors inline-block">Careers</Link></li>
                            </ul>
                        </nav>
                    </div>
                </div>

                <hr className="border-white/10 mb-8" />

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-500">
                        <Link href="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link>
                        <span className="text-gray-700">|</span>
                        <Link href="/terms" className="hover:text-gold transition-colors">Terms of Service</Link>
                        <span className="text-gray-700">|</span>
                        <Link href="/accessibility" className="hover:text-gold transition-colors">Accessibility</Link>
                    </div>

                    <p className="text-gray-500 text-sm text-center">
                        © {new Date().getFullYear()} Hyderabad Clothing. All rights reserved.
                    </p>

                    <div className="flex items-center gap-4">
                        <span className="text-gray-500 text-sm">We Accept:</span>
                        <div className="flex items-center gap-3 text-gray-400">
                            <FaCreditCard size={28} className="hover:text-gold transition-colors" aria-label="Credit Card" />
                            <FaGooglePay size={36} className="hover:text-gold transition-colors" aria-label="Google Pay" />
                            <FaApplePay size={36} className="hover:text-gold transition-colors" aria-label="Apple Pay" />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
