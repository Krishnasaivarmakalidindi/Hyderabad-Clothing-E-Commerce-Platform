import React, { useState } from 'react';
import Head from 'next/head';
import { Ruler } from 'lucide-react';
import Layout from '../components/Layout';

export default function SizeGuide() {
    const [activeTab, setActiveTab] = useState<'kurtas' | 'blouses' | 'mens'>('kurtas');

    return (
        <Layout>
            <Head>
                <title>Size Guide | Hyderabad Clothing</title>
                <meta name="description" content="Find your perfect fit with our comprehensive size charts." />
            </Head>

            <div className="bg-cream-50 min-h-screen py-12">
                <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                    <div className="text-center mb-12">
                        <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Ruler size={32} />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-brown-900 mb-4">Size Guide</h1>
                        <p className="text-brown-600">
                            Use these charts to find your perfect fit. All measurements are in inches.
                        </p>
                    </div>

                    <div className="flex justify-center mb-8 gap-2 overflow-x-auto pb-2">
                        {['kurtas', 'blouses', 'mens'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`px-6 py-2 rounded-full font-medium capitalize transition-colors ${activeTab === tab
                                        ? 'bg-vermilion text-white shadow-md'
                                        : 'bg-white text-brown-600 hover:bg-gray-100 border border-gray-200'
                                    }`}
                            >
                                {tab === 'mens' ? "Men's Wear" : tab}
                            </button>
                        ))}
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-brown-900">
                                        <th className="p-4 font-bold border-b border-gray-200">Size</th>
                                        <th className="p-4 font-bold border-b border-gray-200">Bust (in)</th>
                                        <th className="p-4 font-bold border-b border-gray-200">Waist (in)</th>
                                        <th className="p-4 font-bold border-b border-gray-200">Hips (in)</th>
                                        {activeTab === 'mens' && <th className="p-4 font-bold border-b border-gray-200">Length (in)</th>}
                                    </tr>
                                </thead>
                                <tbody className="text-brown-600">
                                    {activeTab === 'kurtas' && (
                                        <>
                                            <tr className="border-b border-gray-100 hover:bg-gray-50"><td className="p-4 font-medium">XS</td><td className="p-4">32</td><td className="p-4">28</td><td className="p-4">34</td></tr>
                                            <tr className="border-b border-gray-100 hover:bg-gray-50"><td className="p-4 font-medium">S</td><td className="p-4">34</td><td className="p-4">30</td><td className="p-4">36</td></tr>
                                            <tr className="border-b border-gray-100 hover:bg-gray-50"><td className="p-4 font-medium">M</td><td className="p-4">36</td><td className="p-4">32</td><td className="p-4">38</td></tr>
                                            <tr className="border-b border-gray-100 hover:bg-gray-50"><td className="p-4 font-medium">L</td><td className="p-4">38</td><td className="p-4">34</td><td className="p-4">40</td></tr>
                                            <tr className="border-b border-gray-100 hover:bg-gray-50"><td className="p-4 font-medium">XL</td><td className="p-4">40</td><td className="p-4">36</td><td className="p-4">42</td></tr>
                                            <tr className="hover:bg-gray-50"><td className="p-4 font-medium">XXL</td><td className="p-4">42</td><td className="p-4">38</td><td className="p-4">44</td></tr>
                                        </>
                                    )}
                                    {activeTab === 'blouses' && (
                                        <>
                                            <tr className="border-b border-gray-100 hover:bg-gray-50"><td className="p-4 font-medium">32</td><td className="p-4">32</td><td className="p-4">26</td><td className="p-4">-</td></tr>
                                            <tr className="border-b border-gray-100 hover:bg-gray-50"><td className="p-4 font-medium">34</td><td className="p-4">34</td><td className="p-4">28</td><td className="p-4">-</td></tr>
                                            <tr className="border-b border-gray-100 hover:bg-gray-50"><td className="p-4 font-medium">36</td><td className="p-4">36</td><td className="p-4">30</td><td className="p-4">-</td></tr>
                                            <tr className="border-b border-gray-100 hover:bg-gray-50"><td className="p-4 font-medium">38</td><td className="p-4">38</td><td className="p-4">32</td><td className="p-4">-</td></tr>
                                            <tr className="hover:bg-gray-50"><td className="p-4 font-medium">40</td><td className="p-4">40</td><td className="p-4">34</td><td className="p-4">-</td></tr>
                                        </>
                                    )}
                                    {activeTab === 'mens' && (
                                        <>
                                            <tr className="border-b border-gray-100 hover:bg-gray-50"><td className="p-4 font-medium">S (36)</td><td className="p-4">36</td><td className="p-4">-</td><td className="p-4">-</td><td className="p-4">38</td></tr>
                                            <tr className="border-b border-gray-100 hover:bg-gray-50"><td className="p-4 font-medium">M (38)</td><td className="p-4">38</td><td className="p-4">-</td><td className="p-4">-</td><td className="p-4">40</td></tr>
                                            <tr className="border-b border-gray-100 hover:bg-gray-50"><td className="p-4 font-medium">L (40)</td><td className="p-4">40</td><td className="p-4">-</td><td className="p-4">-</td><td className="p-4">42</td></tr>
                                            <tr className="border-b border-gray-100 hover:bg-gray-50"><td className="p-4 font-medium">XL (42)</td><td className="p-4">42</td><td className="p-4">-</td><td className="p-4">-</td><td className="p-4">44</td></tr>
                                            <tr className="hover:bg-gray-50"><td className="p-4 font-medium">XXL (44)</td><td className="p-4">44</td><td className="p-4">-</td><td className="p-4">-</td><td className="p-4">46</td></tr>
                                        </>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-6 bg-gray-50 border-t border-gray-200">
                            <p className="text-sm text-brown-500">
                                <strong>Note:</strong> Garment measurements may vary by +/- 0.5 inches. For sizes larger than XXL, please contact us for custom stitching.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
