/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV !== 'production';
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
            },
            {
                protocol: 'https',
                hostname: 'hyderabad-clothing-images.s3.ap-south-1.amazonaws.com',
            },
            {
                protocol: 'https',
                hostname: 'images.pexels.com',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
        ],
        unoptimized: isDev,
    },
    i18n: {
        locales: ['en', 'te'],
        defaultLocale: 'en',
    },
    env: {
        API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
        RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    },
}

module.exports = nextConfig
