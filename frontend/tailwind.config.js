/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#F6F7FB',
          card: '#FFFFFF',
          muted: '#F0F2F4',
        },
        ink: {
          primary: '#172033',
          secondary: '#667085',
          border: '#E3E7EB',
          subtle: '#F0F2F4',
        },
        // Role 1: Employee (Blue & Indigo)
        emp: {
          primary: '#4F46E5',
          secondary: '#64748B',
          bg: '#F6F7FB',
          sidebar: '#182234',
          text: '#172033',
          subtext: '#667085',
          accent: '#3B82F6',
          success: '#15803D',
          warning: '#D97706',
          error: '#DC2626',
        },
        // Role 2: HR (Teal & Emerald)
        hr: {
          primary: '#0F766E',
          secondary: '#16A34A',
          bg: '#F4F8F6',
          sidebar: '#0A362C',
          text: '#172B2A',
          subtext: '#647572',
          accent: '#10B981',
          warning: '#D97706',
          error: '#DC2626',
        },
        // Role 3: Admin (Charcoal & Muted Blue)
        adm: {
          primary: '#2563EB',
          secondary: '#0F766E',
          sidebar: '#202938',
          bg: '#F3F5F8',
          text: '#182230',
          subtext: '#667085',
          accent: '#4F46E5',
          success: '#16A34A',
          warning: '#D97706',
          error: '#DC2626',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'sm': '4px',
        'DEFAULT': '6px',
        'md': '6px',
        'lg': '8px',
        'xl': '12px',
        '2xl': '16px',
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgb(0 0 0 / 0.03)',
        'soft': '0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.03)',
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px 0 rgb(0 0 0 / 0.03)',
        'elevated': '0 4px 16px -2px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.04)',
      },
    },
  },
  plugins: [],
}