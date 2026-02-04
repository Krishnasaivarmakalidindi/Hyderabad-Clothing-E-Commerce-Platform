import React from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import { FaQuestionCircle, FaPhone, FaEnvelope, FaExclamationCircle } from 'react-icons/fa';

export default function Help() {
    const faqs = [
        {
            q: "How do I check my order status?",
            a: "You can track your order by visiting the 'Track Order' page linked in the footer or by logging into your account and viewing 'My Orders'."
        },
        {
            q: "What is your return policy?",
            a: "We offer a 7-day return policy for all unused items with original tags. Please visit our Returns & Exchanges page for more details."
        },
        {
            q: "Do you ship internationally?",
            a: "Currently, we ship within India only. International shipping will be enabled soon."
        },
        {
            q: "What payment methods do you accept?",
            a: "We accept Credit/Debit Cards, Net Banking, UPI, and Cash on Delivery (COD)."
        }
    ];

    return (
        <Layout title="Help & Support - Hyderabad Clothing">
            <div className="bg-cream-50 min-h-screen py-10">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h1 className="text-4xl font-black text-brown-900 mb-2 text-center">How can we help?</h1>
                    <p className="text-center text-brown-600 mb-12">Find answers to common questions or get in touch with our support team.</p>

                    <div className="grid md:grid-cols-2 gap-8 mb-16">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-cream-200 hover:shadow-md transition-all">
                            <FaPhone className="text-3xl text-vermilion mb-4" />
                            <h3 className="font-bold text-xl text-brown-900 mb-2">Customer Support</h3>
                            <p className="text-brown-600 mb-4">Call us at +91 98765 43210 <br />(10 AM - 7 PM, Mon-Sat)</p>
                            <a href="tel:+919876543210" className="text-vermilion font-bold hover:underline">Call Now</a>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-cream-200 hover:shadow-md transition-all">
                            <FaEnvelope className="text-3xl text-vermilion mb-4" />
                            <h3 className="font-bold text-xl text-brown-900 mb-2">Email Support</h3>
                            <p className="text-brown-600 mb-4">Email us at support@hyderabadclothing.com <br />We usually reply within 24 hours.</p>
                            <a href="mailto:support@hyderabadclothing.com" className="text-vermilion font-bold hover:underline">Send Email</a>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-brown-900 mb-6 flex items-center gap-2">
                        <FaQuestionCircle className="text-accent-gold" /> Frequently Asked Questions
                    </h2>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-cream-200">
                                <h3 className="font-bold text-lg text-brown-900 mb-2">{faq.q}</h3>
                                <p className="text-brown-600 leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center bg-brown-900 text-white p-8 rounded-2xl">
                        <FaExclamationCircle className="text-4xl mx-auto mb-4 text-accent-gold" />
                        <h3 className="text-2xl font-bold mb-2">Still need help?</h3>
                        <p className="text-white/80 mb-6">Our support team is just a click away.</p>
                        <Link href="/contact" className="inline-block bg-accent-gold text-brown-900 font-bold py-3 px-8 rounded-full hover:bg-white transition-all">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
