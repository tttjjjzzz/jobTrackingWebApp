import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#0f1117',
          elevated: '#1a1b23',
        },
        accent: {
          DEFAULT: '#6366f1',
          hover: '#818cf8',
          light: 'rgba(99, 102, 241, 0.15)',
        },
        glass: {
          border: 'rgba(255, 255, 255, 0.15)',
        },
      },
      borderRadius: {
        glass: '16px',
      },
      backdropBlur: {
        glass: '16px',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0, 0, 0, 0.12)',
        'glass-lg': '0 8px 40px rgba(0, 0, 0, 0.2)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
