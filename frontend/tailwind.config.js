/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // 2026 Luxury Chromatic Profile
                pearl: {
                    50: '#FEFDFB',
                    100: '#FCFBF4',
                    200: '#F8F6ED',
                    DEFAULT: '#FCFBF4',
                },
                vermilion: {
                    50: '#FEF2F1',
                    100: '#FDE3E1',
                    200: '#FCCBC7',
                    300: '#F9A8A1',
                    400: '#F4766B',
                    500: '#E34234',
                    600: '#D03527',
                    700: '#AE2A1E',
                    800: '#90261D',
                    900: '#78251E',
                    DEFAULT: '#E34234',
                },
                gold: {
                    50: '#FBF8EB',
                    100: '#F6EFD2',
                    200: '#EDDFA8',
                    300: '#E1C974',
                    400: '#D4B14B',
                    500: '#B59410',
                    600: '#9A7A0D',
                    700: '#7A5E0F',
                    800: '#654C14',
                    900: '#563F16',
                    DEFAULT: '#B59410',
                },
                teal: {
                    50: '#EFFEFE',
                    100: '#C7FFFE',
                    200: '#8FFFFC',
                    300: '#4FF8F4',
                    400: '#19E5E2',
                    500: '#008080',
                    600: '#04A5A0',
                    700: '#0A8380',
                    800: '#0E6866',
                    900: '#105655',
                    DEFAULT: '#008080',
                },
                // Legacy mappings for compatibility
                'primary-red': '#E34234',
                'primary-hover': '#D03527',
                'accent-gold': '#B59410',
                'bg-page': '#FCFBF4',
                'bg-card': '#FFFFFF',
                'text-main': '#1F1F1F',
                'text-muted': '#6B7280',
                cream: {
                    50: '#FCFBF4',
                    100: '#F8F6ED',
                    200: '#F3F0E3',
                    DEFAULT: '#FCFBF4',
                },
                brown: {
                    900: '#1F1F1F',
                    600: '#6B7280',
                    500: '#9CA3AF',
                },
            },
            fontFamily: {
                serif: ['Playfair Display', 'Georgia', 'serif'],
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'shimmer': 'shimmer 2s linear infinite',
                'fade-up': 'fadeUp 0.6s ease-out forwards',
                'scale-in': 'scaleIn 0.5s ease-out forwards',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                fadeUp: {
                    '0%': { opacity: '0', transform: 'translateY(30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.9)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
            },
        },
    },
    plugins: [],
}
