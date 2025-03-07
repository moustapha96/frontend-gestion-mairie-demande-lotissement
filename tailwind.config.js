import colors from 'tailwindcss/colors'
import prelinePlugin from 'preline/plugin'
import tailwindForms from '@tailwindcss/forms'
import tailwindTypography from '@tailwindcss/typography'
import { createThemes } from 'tw-colors'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{css,js,ts,jsx,tsx}',
    './node_modules/preline/preline.js',
  ],

  darkMode: ['class'],
  safelist: [
    {
      pattern: /border-(sky|pink|purple)-500\/40/,
    },
    {
      pattern: /text-(sky|pink|purple)-500/,
    },
    {
      pattern: /bg-(sky|pink|purple)-500\/20/,
    },
    {
      pattern: /border-(sky|pink|purple)-500\/20/,
      variants: ['hover'],
    },
    {
      pattern: /bg-(sky|pink|purple)-500\/5/,
      variants: ['hover'],
    },
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },

    fontFamily: {
      body: ['REM', 'sans-serif'],
    },

    extend: {
      colors: {
        primary: {
          DEFAULT: "#e28743", // 🟠 Orange principal (burntSienna)
          light: "#eab676", // 🟠 Orange clair (tacao)
          dark: "#21130d", // 🟤 Marron foncé (eternity)
        },

        secondary: {
          DEFAULT: "#2D7DBA", // 🔵 Bleu principal (blueLogo)
          light: "#09aef8", // 🔵 Bleu clair (blueLight)
          dark: "#063970", // 🔵 Bleu foncé (catalinaBlue)
        },

        accent: {
          DEFAULT: "#76b5c5", // 🔵 Bleu glacier (glacier)
          soft: "#abdbe3", // 🔵 Bleu poudré (powderBlue)
          deep: "#154c79", // 🔵 Bleu moyen (chathamsBlue)
        },

        neutral: {
          white: "#eeeee4", // ⚪ Blanc doux (greenWhite)
          dark: "#1D1D1D", // ⚫ Noir profond (qblack)
          gray: "#797979", // 🌫️ Gris neutre (qgray)
          graySoft: "#8E8E8E", // 🌫️ Gris doux (qgrayTwo)
        },

        danger: {
          DEFAULT: "#e41021", // 🔴 Rouge principal (redLogo)
          dark: "#EF262C", // 🔴 Rouge intense (qred)
        },

        brown: {
          DEFAULT: "#873e23", // 🟤 Marron principal (burntUmber)
        },
      },

      zIndex: {
        60: '60',
        70: '70',
      },

      keyframes: {
        load: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      },
    },
  },

  plugins: [
    prelinePlugin,
    tailwindForms,
    tailwindTypography,
    createThemes(
      {
        light: {
          default: colors.zinc,
        },

        dark: {
          default: {
            50: '#09090b',
            100: '#18181b',
            200: '#27272a',
            300: '#3f3f46',
            400: '#52525b',
            500: '#71717a',
            600: '#a1a1aa',
            700: '#d4d4d8',
            800: '#e4e4e7',
            900: '#f4f4f5',
            950: '#fafafa',
          },
        },
      },
      {
        defaultTheme: 'light',
      }
    ),
  ],
}
