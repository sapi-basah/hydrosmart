import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                display: ['var(--font-cormorant)', 'serif'],
                body: ['var(--font-outfit)', 'sans-serif'],
            },
            colors: {
                ivory: '#FAF9F6',
                sage: {
                    DEFAULT: '#8DA399',
                    light: '#a8bcb5',
                    dark: '#6b8a7e',
                    deep: '#2C3E35',
                },
                cream: '#F0EDE8',
            },
            animation: {
                'fade-up': 'fadeUp 0.7s ease-out forwards',
                'fade-in': 'fadeIn 0.5s ease-out forwards',
            },
            keyframes: {
                fadeUp: {
                    '0%': { opacity: '0', transform: 'translateY(24px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}

export default config