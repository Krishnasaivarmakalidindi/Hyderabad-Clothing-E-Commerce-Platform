import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
    className?: string;
}

export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
    const { theme, toggleTheme, isDark } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={`theme-toggle ${isDark ? 'dark' : ''} ${className} haptic-click`}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            title={`Switch to ${isDark ? 'Light' : 'Royal Night'} mode`}
        >
            <span className="theme-toggle-handle">
                {isDark ? (
                    <Moon size={12} className="text-gold" />
                ) : (
                    <Sun size={12} className="text-amber-500" />
                )}
            </span>
        </button>
    );
}
