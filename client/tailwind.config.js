import { heroui } from "@heroui/theme";
import scrollbarHide from "tailwind-scrollbar-hide";
import tailwindCssTypography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/layout/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/routes/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    tailwindCssTypography,
    scrollbarHide,
    heroui({
      prefix: "heroui",
      addCommonColors: false, // override common colors (e.g. "blue",green,"pink").
      defaultTheme: "light", // default theme from the themes object
      themes: {
        dark: {
          colors: {
            default: {
              50: "#060804",
              100: "#0d1107",
              200: "#13190b",
              300: "#1a220e",
              400: "#202a12",
              500: "#4d5541",
              600: "#797f71",
              700: "#a6aaa0",
              800: "#d2d4d0",
              900: "#ffffff",
              foreground: "#fff",
              DEFAULT: "#202a12",
            },
            primary: {
              50: "#424d2d",
              100: "#697947",
              200: "#8fa662",
              300: "#b6d27c",
              400: "#dcff96",
              500: "#e2ffa8",
              600: "#e8ffbb",
              700: "#eeffcd",
              800: "#f5ffe0",
              900: "#fbfff2",
              foreground: "#000",
              DEFAULT: "#dcff96",
            },
            secondary: {
              50: "#4d443c",
              100: "#796c5f",
              200: "#a69481",
              300: "#d2bca4",
              400: "#ffe4c7",
              500: "#ffe9d1",
              600: "#ffeddb",
              700: "#fff2e4",
              800: "#fff7ee",
              900: "#fffcf8",
              foreground: "#000",
              DEFAULT: "#ffe4c7",
            },
            success: {
              50: "#073c1e",
              100: "#0b5f30",
              200: "#0f8341",
              300: "#13a653",
              400: "#17c964",
              500: "#40d27f",
              600: "#68dc9a",
              700: "#91e5b5",
              800: "#b9efd1",
              900: "#e2f8ec",
              foreground: "#000",
              DEFAULT: "#17c964",
            },
            warning: {
              50: "#4a320b",
              100: "#744e11",
              200: "#9f6b17",
              300: "#ca881e",
              400: "#f5a524",
              500: "#f7b54a",
              600: "#f9c571",
              700: "#fad497",
              800: "#fce4bd",
              900: "#fef4e4",
              foreground: "#000",
              DEFAULT: "#f5a524",
            },
            danger: {
              50: "#49051d",
              100: "#73092e",
              200: "#9e0c3e",
              300: "#c80f4f",
              400: "#f31260",
              500: "#f53b7c",
              600: "#f76598",
              700: "#f98eb3",
              800: "#fbb8cf",
              900: "#fee1eb",
              foreground: "#000",
              DEFAULT: "#f31260",
            },
            background: "#0C0C08",
            foreground: "#ffffff",
            content1: {
              DEFAULT: "#13170D",
              foreground: "#fff",
            },
            content2: {
              DEFAULT: "#27272a",
              foreground: "#fff",
            },
            content3: {
              DEFAULT: "#3f3f46",
              foreground: "#fff",
            },
            content4: {
              DEFAULT: "#52525b",
              foreground: "#fff",
            },
            focus: "#006FEE",
            overlay: "#ffffff",
          },
        },
      },

      layout: {
        disabledOpacity: "0.5",

      },
    }),
  ],
};
