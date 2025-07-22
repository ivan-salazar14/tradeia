// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './src/app/**/*.{ts,tsx,js,jsx}',
      './src/components/**/*.{ts,tsx,js,jsx}',
      './src/contexts/**/*.{ts,tsx,js,jsx}',
      './src/lib/**/*.{ts,tsx,js,jsx}',
      './src/**/*.{ts,tsx,js,jsx}',
      './docs/ui/base.md',
    ],
    safelist: [
      'bg-primary', 'bg-secondary', 'bg-cardbg',
      'text-primary', 'text-secondary', 'text-cardbg',
      'text-textdark', 'text-textlight',
      'bg-success', 'bg-danger', 'bg-warning', 'bg-info',
      'text-success', 'text-danger', 'text-warning', 'text-info',
      'border-primary', 'border-secondary', 'border-cardbg',
      'border-success', 'border-danger', 'border-warning', 'border-info',
    ],
    theme: {
      extend: {
        fontFamily: {
          inter: ['Inter', 'sans-serif'],
        },
        colors: {
          primary: '#4f46e5', // Indigo
          secondary: '#f0f2f5', // Light gray background
          cardbg: '#ffffff',
          textdark: '#1f2937',
          textlight: '#6b7280',
          success: '#10B981', // Green
          danger: '#EF4444', // Red
          warning: '#f97316', // Orange
          info: '#14b8a6', // Teal
        },
      },
    },
    plugins: [],
  }
  