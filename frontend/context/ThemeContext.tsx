import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('light');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Check localStorage first, then system preference
        const stored = localStorage.getItem('theme') as Theme | null;
        if (stored) {
            setThemeState(stored);
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setThemeState('dark');
        }
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
            root.style.setProperty('--bg-primary', '#0A0A0F');
            root.style.setProperty('--bg-secondary', '#12121A');
            root.style.setProperty('--bg-card', 'rgba(26, 26, 36, 0.8)');
            root.style.setProperty('--text-primary', '#FAFAFA');
            root.style.setProperty('--text-secondary', '#A1A1AA');
            root.style.setProperty('--border-color', 'rgba(255, 255, 255, 0.1)');
        } else {
            root.classList.remove('dark');
            root.style.setProperty('--bg-primary', '#FCFBF4');
            root.style.setProperty('--bg-secondary', '#FFFFFF');
            root.style.setProperty('--bg-card', '#FFFFFF');
            root.style.setProperty('--text-primary', '#1F1F1F');
            root.style.setProperty('--text-secondary', '#6B7280');
            root.style.setProperty('--border-color', 'rgba(0, 0, 0, 0.1)');
        }
        localStorage.setItem('theme', theme);
    }, [theme, mounted]);

    const toggleTheme = () => {
        setThemeState(prev => prev === 'light' ? 'dark' : 'light');
    };

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
    };

    // Prevent flash of wrong theme
    if (!mounted) {
        return null;
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, isDark: theme === 'dark' }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
}
