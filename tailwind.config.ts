// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  /* 💡 [핵심 교정] 모든 폴더가 루트에 있으므로 아래 규격을 정확하게 찔러주어야 합니다. */
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
    './actions/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-navy': 'var(--brand-navy)',
        'brand-blue': 'var(--brand-blue)',
        'brand-pastel': 'var(--brand-pastel)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
