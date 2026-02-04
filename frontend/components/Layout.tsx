import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import Head from 'next/head';

interface LayoutProps {
    children: React.ReactNode;
    title?: string;
}

const Layout = ({ children, title = 'Hyderabad Clothing - Premium Ethnic Wear' }: LayoutProps) => {
    return (
        <div className="min-h-screen flex flex-col bg-cream-50 font-sans">
            <Head>
                <title>{title}</title>
                <meta name="description" content="Premium ethnic wear from Hyderabad's finest manufacturers" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Navbar />

            <main className="flex-grow">
                {children}
            </main>

            <Footer />
        </div>
    );
};

export default Layout;
