import React, { useState } from 'react';
import Head from 'next/head';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Layout from '../components/Layout';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        // Simulate API call
        setTimeout(() => {
            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 1500);
    };

    return (
        <Layout>
            <Head>
                <title>Contact Us | Hyderabad Clothing</title>
                <meta name="description" content="Get in touch with Hyderabad Clothing for inquiries or support." />
            </Head>

            <div className="bg-cream-50 min-h-screen py-12">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-16">
                        <h1 className="text-3xl md:text-4xl font-black text-brown-900 mb-4">Contact Us</h1>
                        <p className="text-brown-600 max-w-xl mx-auto">
                            Have a question about an order or just want to say hello? We'd love to hear from you.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                        {/* Contact Info */}
                        <div className="space-y-8">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-cream-200">
                                <h3 className="text-xl font-bold text-brown-900 mb-6">Get in Touch</h3>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-vermilion/10 text-vermilion rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Phone size={20} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-brown-900">Phone & WhatsApp</p>
                                            <p className="text-brown-600">+91 98765 43210</p>
                                            <p className="text-xs text-brown-500 mt-1">Mon-Sat, 10am - 7pm IST</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-vermilion/10 text-vermilion rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Mail size={20} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-brown-900">Email</p>
                                            <p className="text-brown-600">support@hyderabadclothing.com</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-vermilion/10 text-vermilion rounded-lg flex items-center justify-center flex-shrink-0">
                                            <MapPin size={20} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-brown-900">Store Address</p>
                                            <p className="text-brown-600">
                                                Hyderabad Clothing<br />
                                                Road No. 12, Banjara Hills<br />
                                                Hyderabad, Telangana 500034
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-cream-200">
                            <h3 className="text-xl font-bold text-brown-900 mb-6">Send us a Message</h3>
                            {status === 'success' ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-gold/20 text-gold rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Send size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gold mb-2">Message Sent!</h3>
                                    <p className="text-brown-600">Thanks for reaching out. We'll get back to you shortly.</p>
                                    <button
                                        onClick={() => setStatus('idle')}
                                        className="mt-6 text-vermilion hover:underline"
                                    >
                                        Send another message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-brown-700 mb-1">Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            required
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-vermilion focus:border-transparent outline-none transition-all"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-brown-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            required
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-vermilion focus:border-transparent outline-none transition-all"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-medium text-brown-700 mb-1">Subject</label>
                                        <select
                                            id="subject"
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-vermilion focus:border-transparent outline-none transition-all"
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        >
                                            <option value="">Select a subject</option>
                                            <option value="Order Status">Order Status</option>
                                            <option value="Return/Exchange">Return/Exchange Request</option>
                                            <option value="Product Inquiry">Product Inquiry</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-brown-700 mb-1">Message</label>
                                        <textarea
                                            id="message"
                                            required
                                            rows={4}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-vermilion focus:border-transparent outline-none transition-all"
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        ></textarea>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={status === 'submitting'}
                                        className="w-full bg-vermilion text-white font-bold py-3 rounded-lg hover:bg-vermilion-600 transition-colors shadow-lg shadow-red-200 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {status === 'submitting' ? 'Sending...' : 'Send Message'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
