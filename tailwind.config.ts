import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#ecfeff',
          500: '#22d3ee',
          600: '#06b6d4',
          700: '#0ea5e9'
        },
        slatebg: '#07111f'
      },
      boxShadow: {
        glow: '0 20px 40px rgba(34, 211, 238, 0.18)'
      }
    }
  },
  plugins: []
};

export default config;
