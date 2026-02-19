import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import Link from 'next/link';
import { products as allProducts } from '../data/products';

// Product data for 3D Slider - derived from unified product data
const products = allProducts.slice(0, 11).map(p => ({
    id: String(p.id),
    image: p.images[0],
    title: p.name,
    desc: (p.description || '').slice(0, 100) + '...'
}));

// Position configurations for 3D effect
const positions = [
    { height: 620, z: 220, rotateY: 48, y: 0, clip: 'polygon(0px 0px, 100% 10%, 100% 90%, 0px 100%)' },
    { height: 580, z: 165, rotateY: 35, y: 0, clip: 'polygon(0px 0px, 100% 8%, 100% 92%, 0px 100%)' },
    { height: 495, z: 110, rotateY: 15, y: 0, clip: 'polygon(0px 0px, 100% 7%, 100% 93%, 0px 100%)' },
    { height: 420, z: 66, rotateY: 15, y: 0, clip: 'polygon(0px 0px, 100% 7%, 100% 93%, 0px 100%)' },
    { height: 353, z: 46, rotateY: 6, y: 0, clip: 'polygon(0px 0px, 100% 7%, 100% 93%, 0px 100%)' },
    { height: 310, z: 0, rotateY: 0, y: 0, clip: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' },
    { height: 353, z: 54, rotateY: 348, y: 0, clip: 'polygon(0px 7%, 100% 0px, 100% 100%, 0px 93%)' },
    { height: 420, z: 89, rotateY: -15, y: 0, clip: 'polygon(0px 7%, 100% 0px, 100% 100%, 0px 93%)' },
    { height: 495, z: 135, rotateY: -15, y: 1, clip: 'polygon(0px 7%, 100% 0px, 100% 100%, 0px 93%)' },
    { height: 580, z: 195, rotateY: 325, y: 0, clip: 'polygon(0px 8%, 100% 0px, 100% 100%, 0px 92%)' },
    { height: 620, z: 240, rotateY: 312, y: 0, clip: 'polygon(0px 10%, 100% 0px, 100% 100%, 0px 90%)' }
];

const Featured3DSlider: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const cardInfoRef = useRef<HTMLDivElement>(null);
    const closeBtnRef = useRef<HTMLButtonElement>(null);

    const [cardOrder, setCardOrder] = useState<number[]>(products.map((_, i) => i));
    const [expandedCard, setExpandedCard] = useState<{ index: number; data: typeof products[0] } | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isBlurred, setIsBlurred] = useState(false);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
    const autoPlayDelay = 4000; // 4 seconds between slides

    const dragState = useRef({
        startX: 0,
        dragDistance: 0,
        processedSteps: 0,
        threshold: 60
    });
    const cloneRef = useRef<HTMLDivElement | null>(null);

    // Apply initial positions
    useEffect(() => {
        cardRefs.current.forEach((card, index) => {
            if (card) {
                const pos = positions[index];
                gsap.set(card, {
                    height: pos.height,
                    clipPath: pos.clip,
                    transform: `translateZ(${pos.z}px) rotateY(${pos.rotateY}deg) translateY(${pos.y}px)`,
                    willChange: 'transform, height, clip-path'
                });
            }
        });
    }, [cardOrder]);

    // Pause auto-play on hover
    const handleMouseEnter = useCallback(() => {
        setIsAutoPlaying(false);
    }, []);

    const handleMouseLeave = useCallback(() => {
        if (!expandedCard) {
            setIsAutoPlaying(true);
        }
    }, [expandedCard]);

    const rotate = useCallback((direction: 'next' | 'prev') => {
        if (expandedCard) return;

        cardRefs.current.forEach((card, index) => {
            if (!card) return;

            let newIndex: number;
            if (direction === 'next') {
                newIndex = (index - 1 + products.length) % products.length;
            } else {
                newIndex = (index + 1) % products.length;
            }

            const pos = positions[newIndex];

            gsap.to(card, {
                height: pos.height,
                clipPath: pos.clip,
                transform: `translateZ(${pos.z}px) rotateY(${pos.rotateY}deg) translateY(${pos.y}px)`,
                duration: 1,
                ease: 'power3.inOut',
                overwrite: 'auto'
            });
        });

        setCardOrder(prev => {
            const newOrder = [...prev];
            if (direction === 'next') {
                const first = newOrder.shift()!;
                newOrder.push(first);
            } else {
                const last = newOrder.pop()!;
                newOrder.unshift(last);
            }
            return newOrder;
        });
    }, [expandedCard]);

    // Auto-slider functionality
    useEffect(() => {
        if (isAutoPlaying && !expandedCard && !isDragging) {
            autoPlayRef.current = setInterval(() => {
                rotate('next');
            }, autoPlayDelay);
        }

        return () => {
            if (autoPlayRef.current) {
                clearInterval(autoPlayRef.current);
                autoPlayRef.current = null;
            }
        };
    }, [isAutoPlaying, expandedCard, isDragging, rotate]);

    const expandCard = useCallback((cardElement: HTMLDivElement, productIndex: number) => {
        if (expandedCard) return;

        const product = products[productIndex];
        setExpandedCard({ index: productIndex, data: product });

        const rect = cardElement.getBoundingClientRect();
        const clone = cardElement.cloneNode(true) as HTMLDivElement;
        const overlay = clone.querySelector('.slider-3d-hover-overlay');
        if (overlay) overlay.remove();

        clone.style.position = 'fixed';
        clone.style.left = `${rect.left}px`;
        clone.style.top = `${rect.top}px`;
        clone.style.width = `${rect.width}px`;
        clone.style.height = `${rect.height}px`;
        clone.style.margin = '0';
        clone.style.zIndex = '1000';
        clone.classList.add('slider-3d-clone');

        document.body.appendChild(clone);
        cloneRef.current = clone;

        gsap.set(cardElement, { opacity: 0 });
        setIsBlurred(true);

        const maxHeight = window.innerHeight * 0.8;
        const finalWidth = 500;
        const finalHeight = Math.min(650, maxHeight);
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        gsap.to(clone, {
            width: finalWidth,
            height: finalHeight,
            left: centerX - finalWidth / 2,
            top: centerY - finalHeight / 2,
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            transform: 'translateZ(0) rotateY(0deg)',
            duration: 0.9,
            ease: 'power3.inOut'
        });
    }, [expandedCard]);

    const closeCard = useCallback(() => {
        if (!expandedCard || !cloneRef.current) return;

        const cardElement = cardRefs.current[cardOrder.indexOf(expandedCard.index)];
        const clone = cloneRef.current;

        if (!cardElement) return;

        const rect = cardElement.getBoundingClientRect();
        const posIndex = cardOrder.indexOf(expandedCard.index);
        const pos = positions[posIndex];

        gsap.to(clone, {
            width: rect.width,
            height: rect.height,
            left: rect.left,
            top: rect.top,
            clipPath: pos.clip,
            duration: 0.9,
            ease: 'power3.inOut',
            onComplete: () => {
                clone.remove();
                gsap.set(cardElement, { opacity: 1 });
                setIsBlurred(false);
                setExpandedCard(null);
                cloneRef.current = null;
            }
        });
    }, [expandedCard, cardOrder]);

    // Drag handlers
    const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (expandedCard) return;

        setIsDragging(true);
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        dragState.current = {
            ...dragState.current,
            startX: clientX,
            dragDistance: 0,
            processedSteps: 0
        };
    }, [expandedCard]);

    const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
        if (!isDragging) return;

        e.preventDefault();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        dragState.current.dragDistance = clientX - dragState.current.startX;

        const steps = Math.floor(Math.abs(dragState.current.dragDistance) / dragState.current.threshold);

        if (steps > dragState.current.processedSteps) {
            const direction = dragState.current.dragDistance > 0 ? 'prev' : 'next';
            rotate(direction);
            dragState.current.processedSteps = steps;
        }
    }, [isDragging, rotate]);

    const handleDragEnd = useCallback(() => {
        setIsDragging(false);
    }, []);

    // Event listeners
    useEffect(() => {
        document.addEventListener('mousemove', handleDragMove);
        document.addEventListener('touchmove', handleDragMove, { passive: false });
        document.addEventListener('mouseup', handleDragEnd);
        document.addEventListener('touchend', handleDragEnd);

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && expandedCard) {
                closeCard();
            } else if (e.key === 'ArrowLeft' && !expandedCard) {
                rotate('prev');
            } else if (e.key === 'ArrowRight' && !expandedCard) {
                rotate('next');
            }
        };
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mousemove', handleDragMove);
            document.removeEventListener('touchmove', handleDragMove);
            document.removeEventListener('mouseup', handleDragEnd);
            document.removeEventListener('touchend', handleDragEnd);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleDragMove, handleDragEnd, rotate, closeCard, expandedCard]);

    return (
        <section className="slider-3d-section">
            {/* Header */}
            <div className="slider-3d-header">
                <p className="slider-3d-subtitle">Handpicked for You</p>
                <h2 className="slider-3d-title">Explore Our Featured Collection</h2>
            </div>

            {/* Slider Container */}
            <div
                ref={containerRef}
                className={`slider-3d-container ${isDragging ? 'dragging' : ''}`}
                onMouseDown={handleDragStart}
                onTouchStart={handleDragStart}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div
                    ref={trackRef}
                    className={`slider-3d-track ${isBlurred ? 'blurred' : ''}`}
                >
                    {cardOrder.map((productIndex, visualIndex) => {
                        const product = products[productIndex];
                        return (
                            <div
                                key={product.id}
                                ref={el => { cardRefs.current[visualIndex] = el; }}
                                className={`slider-3d-card ${expandedCard?.index === productIndex ? 'expanded' : ''}`}
                                data-title={product.title}
                                data-desc={product.desc}
                                onClick={() => {
                                    const cardEl = cardRefs.current[visualIndex];
                                    if (!isDragging && !expandedCard && cardEl) {
                                        expandCard(cardEl, productIndex);
                                    }
                                }}
                            >
                                <img src={product.image} alt={product.title} />
                                <div className="slider-3d-hover-overlay">
                                    <span>Explore This Piece</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Close Button */}
            <button
                ref={closeBtnRef}
                className={`slider-3d-close-btn ${expandedCard ? 'visible' : ''}`}
                onClick={closeCard}
            >
                <svg viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
            </button>

            {/* Card Info */}
            <div
                ref={cardInfoRef}
                className={`slider-3d-card-info ${expandedCard ? 'visible' : ''}`}
            >
                <h2>{expandedCard?.data.title}</h2>
                <p>{expandedCard?.data.desc}</p>
                {expandedCard && (
                    <Link
                        href={`/products/${expandedCard.data.id}`}
                        className="slider-3d-view-btn"
                    >
                        View Product →
                    </Link>
                )}
            </div>
        </section>
    );
};

export default Featured3DSlider;
