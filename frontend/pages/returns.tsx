import React from 'react';
import Head from 'next/head';
import { RotateCcw, CheckCircle, XCircle } from 'lucide-react';
import Layout from '../components/Layout';

export default function Returns() {
    return (
        <Layout>
            <Head>
                <title>Returns & Exchanges | Hyderabad Clothing</title>
                <meta name="description" content="Easy returns and exchange policy for Hyderabad Clothing customers." />
            </Head>

            <div className="bg-cream-50 min-h-screen py-12">
                <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                    <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
                        <div className="text-center mb-12">
                            <div className="w-16 h-16 bg-red-50 text-vermilion rounded-full flex items-center justify-center mx-auto mb-6">
                                <RotateCcw size={32} />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black text-brown-900 mb-4">Returns & Exchanges Policy</h1>
                            <p className="text-brown-600 max-w-2xl mx-auto">
                                We want you to love what you ordered. If something isn't right, let us know.
                            </p>
                        </div>

                        <div className="space-y-10">
                            <section>
                                <h2 className="text-xl font-bold text-brown-900 mb-4 flex items-center gap-2">
                                    <CheckCircle size={20} className="text-green-600" />
                                    Eligibility for Returns
                                </h2>
                                <ul className="list-disc pl-6 space-y-2 text-brown-600">
                                    <li>Items must be returned within <strong>7 days</strong> of delivery.</li>
                                    <li>Products must be unused, unwashed, and in original condition with all tags attached.</li>
                                    <li>Sarees with stitched blouses or custom alterations are <strong>not eligible</strong> for return.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-brown-900 mb-4 flex items-center gap-2">
                                    <XCircle size={20} className="text-vermilion" />
                                    Non-Returnable Items
                                </h2>
                                <ul className="list-disc pl-6 space-y-2 text-brown-600">
                                    <li>Accessories and jewelry.</li>
                                    <li>Custom-made or personalized items.</li>
                                    <li>Items sold during clearance sales.</li>
                                </ul>
                            </section>

                            <div className="bg-cream-100 p-6 rounded-xl border border-cream-200">
                                <h3 className="font-bold text-brown-900 mb-2">How to Initiate a Return</h3>
                                <p className="text-brown-600 mb-4">
                                    To start a return, please visit our <a href="/track-order" className="text-vermilion font-medium hover:underline">Track Order</a> page or contact our support team.
                                </p>
                                <p className="text-sm text-brown-500">
                                    Refunds will be processed to the original payment method within 5-7 business days after we receive the return.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
