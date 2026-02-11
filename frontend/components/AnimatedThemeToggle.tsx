import React, { useRef, useEffect, useState, useCallback, useLayoutEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import gsap from 'gsap';

interface AnimatedThemeToggleProps {
    className?: string;
}

export default function AnimatedThemeToggle({ className = '' }: AnimatedThemeToggleProps) {
    const { isDark, toggleTheme } = useTheme();
    const containerRef = useRef<HTMLDivElement>(null);
    const sunRef = useRef<SVGGElement>(null);
    const moonRef = useRef<SVGGElement>(null);
    const cloudRef = useRef<SVGPathElement>(null);
    const starsRef = useRef<SVGPolygonElement[]>([]);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Set mounted state
    useEffect(() => {
        setMounted(true);
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    // Set initial positions AFTER component mounts and refs are ready
    useLayoutEffect(() => {
        if (!mounted) return;

        // Use requestAnimationFrame to ensure DOM is ready
        const frame = requestAnimationFrame(() => {
            if (isDark) {
                // Dark mode: show moon, hide sun
                if (sunRef.current) gsap.set(sunRef.current, { opacity: 0 });
                if (cloudRef.current) gsap.set(cloudRef.current, { opacity: 0 });
                if (moonRef.current) gsap.set(moonRef.current, { opacity: 1 });
                starsRef.current.forEach(star => {
                    if (star) gsap.set(star, { opacity: 1 });
                });
            } else {
                // Light mode: show sun, hide moon
                if (sunRef.current) gsap.set(sunRef.current, { opacity: 1 });
                if (cloudRef.current) gsap.set(cloudRef.current, { opacity: 1 });
                if (moonRef.current) gsap.set(moonRef.current, { opacity: 0 });
                starsRef.current.forEach(star => {
                    if (star) gsap.set(star, { opacity: 0 });
                });
            }
        });

        return () => cancelAnimationFrame(frame);
    }, [mounted]);

    // Handle theme toggle animation
    const handleToggle = () => {
        if (isAnimating) return;

        setIsAnimating(true);
        const currentlyDark = isDark;

        if (!currentlyDark) {
            // Light -> Dark: fade out sun, fade in moon
            gsap.to(sunRef.current, { duration: 0.4, opacity: 0, scale: 0.5, ease: "power2.inOut" });
            gsap.to(cloudRef.current, { duration: 0.3, opacity: 0, ease: "power2.inOut" });
            gsap.to(moonRef.current, { duration: 0.4, opacity: 1, scale: 1, ease: "power2.inOut", delay: 0.2 });
            starsRef.current.forEach((star, i) => {
                gsap.to(star, { duration: 0.3, delay: 0.2 + i * 0.03, opacity: 1, ease: "power2.inOut" });
            });
        } else {
            // Dark -> Light: fade out moon, fade in sun
            gsap.to(moonRef.current, { duration: 0.4, opacity: 0, scale: 0.5, ease: "power2.inOut" });
            starsRef.current.forEach(star => {
                gsap.to(star, { duration: 0.2, opacity: 0, ease: "power2.inOut" });
            });
            gsap.to(sunRef.current, { duration: 0.4, opacity: 1, scale: 1, ease: "power2.inOut", delay: 0.2 });
            gsap.to(cloudRef.current, { duration: 0.4, opacity: 1, ease: "power2.inOut", delay: 0.3 });
        }

        toggleTheme();

        timeoutRef.current = setTimeout(() => {
            setIsAnimating(false);
        }, 600);
    };

    const addStarRef = useCallback((el: SVGPolygonElement | null, index: number) => {
        if (el) starsRef.current[index] = el;
    }, []);

    if (!mounted) return null;

    return (
        <div
            ref={containerRef}
            className={`animated-theme-toggle ${className}`}
            style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {/* Toggle Track */}
            <div
                onClick={handleToggle}
                className="toggle-track"
                style={{
                    width: '60px',
                    height: '32px',
                    borderRadius: '100px',
                    cursor: isAnimating ? 'default' : 'pointer',
                    transition: 'background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease',
                    background: isDark
                        ? 'linear-gradient(135deg, #1a365d 0%, #2d3748 100%)'
                        : 'linear-gradient(135deg, #68d391 0%, #48bb78 100%)',
                    border: `2px solid ${isDark ? '#4a5568' : '#38a169'}`,
                    boxShadow: isDark
                        ? 'inset 0 2px 4px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)'
                        : 'inset 0 2px 4px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.1)',
                    position: 'relative',
                    overflow: 'hidden',
                }}
                aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
                title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
            >
                {/* Toggle Circle/Knob */}
                <div
                    style={{
                        position: 'absolute',
                        top: '2px',
                        left: isDark ? '30px' : '2px',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: isDark
                            ? 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%)'
                            : 'linear-gradient(135deg, #faf089 0%, #ecc94b 100%)',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        transition: 'left 0.3s ease, background 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {/* Sun Icon */}
                    <svg
                        ref={sunRef as React.RefObject<SVGSVGElement> as any}
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        style={{
                            position: 'absolute',
                            opacity: isDark ? 0 : 1,
                        }}
                    >
                        <circle cx="12" cy="12" r="5" fill="#f6ad55" />
                        <g stroke="#f6ad55" strokeWidth="2" strokeLinecap="round">
                            <line x1="12" y1="1" x2="12" y2="3" />
                            <line x1="12" y1="21" x2="12" y2="23" />
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                            <line x1="1" y1="12" x2="3" y2="12" />
                            <line x1="21" y1="12" x2="23" y2="12" />
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                        </g>
                    </svg>

                    {/* Moon Icon */}
                    <svg
                        ref={moonRef as React.RefObject<SVGSVGElement> as any}
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        style={{
                            position: 'absolute',
                            opacity: isDark ? 1 : 0,
                        }}
                    >
                        <path
                            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                            fill="#cbd5e0"
                            stroke="#a0aec0"
                            strokeWidth="1"
                        />
                    </svg>
                </div>

                {/* Stars (visible in dark mode) */}
                <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 60 32"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        pointerEvents: 'none',
                    }}
                >
                    <polygon
                        ref={(el) => addStarRef(el, 0)}
                        fill="#fff"
                        points="8,8 9,10 11,10 9.5,11.5 10,14 8,12.5 6,14 6.5,11.5 5,10 7,10"
                        style={{ opacity: isDark ? 1 : 0 }}
                    />
                    <polygon
                        ref={(el) => addStarRef(el, 1)}
                        fill="#fff"
                        points="18,18 18.7,19.5 20.3,19.5 19,20.7 19.4,22.3 18,21.3 16.6,22.3 17,20.7 15.7,19.5 17.3,19.5"
                        style={{ opacity: isDark ? 1 : 0 }}
                    />
                    <polygon
                        ref={(el) => addStarRef(el, 2)}
                        fill="#fff"
                        points="12,22 12.5,23 13.5,23 12.8,23.8 13,25 12,24.3 11,25 11.2,23.8 10.5,23 11.5,23"
                        style={{ opacity: isDark ? 1 : 0 }}
                    />
                    {/* Hidden refs for compatibility */}
                    <path ref={cloudRef as any} d="" style={{ display: 'none' }} />
                </svg>
            </div>
        </div>
    );
}
