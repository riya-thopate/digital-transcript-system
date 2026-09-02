/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Lora', 'Georgia', 'serif'],
      },
      colors: {
        navy: {
          50: '#f0f4f9',
          100: '#dce5f0',
          200: '#b9cce0',
          300: '#8fa9c9',
          400: '#5e7fab',
          500: '#3d6190',
          600: '#2e4d75',
          700: '#273f5f',
          800: '#1f3250',
          900: '#15263d',
          950: '#0d1929',
        },
        gold: {
          50: '#fdfbf3',
          100: '#faf3da',
          200: '#f4e7b3',
          300: '#ecd47e',
          400: '#e3bd4a',
          500: '#d4a72c',
          600: '#bd8a23',
          700: '#9a691f',
          800: '#7c531f',
          900: '#66441f',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.05)',
        'card-hover': '0 4px 12px 0 rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
      },
    },
  },
  plugins: [],
};
