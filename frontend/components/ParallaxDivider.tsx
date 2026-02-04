import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxDividerProps {
    variant?: 'silk' | 'gold' | 'weave' | 'heritage';
    height?: 'sm' | 'md' | 'lg';
    flip?: boolean;
}

const PATTERNS = {
    silk: {
        primary: 'from-pearl via-gold/10 to-pearl dark:from-gray-900 dark:via-gold/5 dark:to-gray-900',
        pattern: `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.73-5.139-1.691-8.233-2.928C65.888 13.278 60.562 12 50 12c-10.626 0-16.855 1.397-26.66 5.063l-1.767.662c-2.475.923-4.66 1.674-6.724 2.275h6.335zm0-20C13.258 2.892 8.077 4 0 4V2c5.744 0 9.951-.574 14.85-2h6.334zM77.38 0C85.239 2.966 90.502 4 100 4V2c-6.842 0-11.386-.542-16.396-2h-6.225zM0 14c8.44 0 13.718-1.21 22.272-4.402l1.768-.661C33.64 5.347 39.647 4 50 4c10.271 0 15.362 1.222 24.629 4.928C84.112 12.722 89.438 14 100 14v-2c-10.271 0-15.362-1.222-24.629-4.928C65.888 3.278 60.562 2 50 2 39.374 2 33.145 3.397 23.34 7.063l-1.767.662C13.223 10.84 8.163 12 0 12v2z' fill='%23B59410' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`
    },
    gold: {
        primary: 'from-gold/20 via-vermilion/10 to-gold/20 dark:from-gold/10 dark:via-vermilion/5 dark:to-gold/10',
        pattern: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23B59410' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
    },
    weave: {
        primary: 'from-pearl via-teal/10 to-pearl dark:from-gray-900 dark:via-teal/5 dark:to-gray-900',
        pattern: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23008080' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`
    },
    heritage: {
        primary: 'from-vermilion/10 via-gold/20 to-vermilion/10 dark:from-vermilion/5 dark:via-gold/10 dark:to-vermilion/5',
        pattern: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='88' height='24' viewBox='0 0 88 24'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23B59410' fill-opacity='0.15'%3E%3Cpath fill-rule='nonzero' d='M20 12.5c0 1.93-1.57 3.5-3.5 3.5H9a3.5 3.5 0 010-7h7.5c1.93 0 3.5 1.57 3.5 3.5zm0-4.5A6.5 6.5 0 0113.5 1.5H9a6.5 6.5 0 000 13h4.5A6.5 6.5 0 0020 8z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
    }
};

const HEIGHTS = {
    sm: 'h-16 md:h-24',
    md: 'h-24 md:h-32',
    lg: 'h-32 md:h-48'
};

export default function ParallaxDivider({
    variant = 'silk',
    height = 'md',
    flip = false
}: ParallaxDividerProps) {
    const { primary, pattern } = PATTERNS[variant];

    return (
        <div
            className={`relative overflow-hidden ${HEIGHTS[height]} ${flip ? 'rotate-180' : ''}`}
            aria-hidden="true"
        >
            {/* Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-r ${primary}`} />

            {/* Animated Pattern Layer */}
            <motion.div
                className="absolute inset-0 opacity-50"
                style={{ backgroundImage: pattern }}
                animate={{
                    backgroundPosition: ['0% 0%', '100% 0%']
                }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: 'linear'
                }}
            />

            {/* Top Wave */}
            <svg
                className="absolute top-0 left-0 w-full h-8 md:h-12"
                viewBox="0 0 1440 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
            >
                <path
                    d="M0 48V0C240 32 480 48 720 48C960 48 1200 32 1440 0V48H0Z"
                    className="fill-pearl dark:fill-gray-900"
                />
            </svg>

            {/* Bottom Wave */}
            <svg
                className="absolute bottom-0 left-0 w-full h-8 md:h-12"
                viewBox="0 0 1440 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
            >
                <path
                    d="M0 0V48C240 16 480 0 720 0C960 0 1200 16 1440 48V0H0Z"
                    className="fill-pearl dark:fill-gray-900"
                />
            </svg>

            {/* Floating Decorative Elements */}
            <motion.div
                className="absolute top-1/2 left-1/4 w-4 h-4 rounded-full bg-gold/30"
                animate={{
                    y: [-10, 10, -10],
                    opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut'
                }}
            />
            <motion.div
                className="absolute top-1/2 right-1/4 w-3 h-3 rounded-full bg-vermilion/30"
                animate={{
                    y: [10, -10, 10],
                    opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 1
                }}
            />
            <motion.div
                className="absolute top-1/3 left-1/2 w-2 h-2 rounded-full bg-teal/30"
                animate={{
                    y: [-5, 5, -5],
                    x: [-5, 5, -5],
                    opacity: [0.2, 0.5, 0.2]
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 2
                }}
            />
        </div>
    );
}

// Simple horizontal line divider
export function SimpleDivider({ className = '' }: { className?: string }) {
    return (
        <div className={`py-12 ${className}`} aria-hidden="true">
            <div className="container mx-auto px-4 md:px-8">
                <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                    <div className="w-2 h-2 rounded-full bg-gold/50" />
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                </div>
            </div>
        </div>
    );
}
