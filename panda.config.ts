import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ['./src/**/*.{js,jsx,ts,tsx}', './pages/**/*.{js,jsx,ts,tsx}'],

  // Files to exclude
  exclude: [],

  jsxFramework: 'react',

  // Useful for theme customization
  theme: {
    extend: {
      keyframes: {
        loadingSpin: {
          '100%': { transform: 'rotate(360deg)' },
        },
        buttonPulse: {
          '0%': { boxShadow: '0 0 0 0 #333a' },
          '40%': { boxShadow: '0 0 0 8px #3333', opacity: 0.7 },
          '80%': { boxShadow: '0 0 0 12px #3333', opacity: 0 },
          '100%': { opacity: 0 },
        },
        shake: {
          '0%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(3deg)' },
          '50%': { transform: 'rotate(0eg)' },
          '75%': { transform: 'rotate(-3deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
      },
    },
  },

  // The output directory for your css system
  outdir: 'styled-system',
})
