import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Colores PXSOL extraídos de la web
        pxsol: {
          dark: '#1a202c',      // Azul oscuro (primary)
          blue: '#0066cc',       // Azul principal
          light: '#f7f9fc',      // Fondo claro
          accent: '#00d4ff',     // Cyan/Accent
          success: '#10b981',    // Verde
          warning: '#f59e0b',    // Ámbar
          danger: '#ef4444',     // Rojo
          gray: '#6b7280',       // Gris
        },
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
      },
      spacing: {
        '128': '32rem',
      },
    },
  },
  plugins: [],
}
export default config
