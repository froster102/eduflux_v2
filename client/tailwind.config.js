import { heroui } from "@heroui/theme";
import scrollbarHide from "tailwind-scrollbar-hide";
import tailwindCssTypography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/components/(alert|button|card|chip|code|divider|dropdown|form|image|input|kbd|link|listbox|modal|navbar|pagination|select|snippet|spinner|toggle|table|user|ripple|menu|popover|scroll-shadow|checkbox|spacer|avatar).js",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    tailwindCssTypography,
    scrollbarHide,
    heroui({
      prefix: "nextui", // prefix for themes variables
      addCommonColors: false, // override common colors (e.g. "blue",green,"pink").
      defaultTheme: "light", // default theme from the themes object
      // defaultExtendTheme: "light", // default theme to extend on custom themes
      layout: {}, // common layout tokens (applied to all themes)
      themes: {
        // light: {
        //   layout: {}, // light theme layout tokens
        //   colors: {
        //     background: "#FBF8F6",
        //     secondary: "#F3EBE5",
        //     light: "#F3C5C5",
        //   }, // light theme colors
        // },
        // dark: {
        //   layout: {}, // dark theme layout tokens
        //   colors: {
        //     primary: "#fafafa",
        //     background: "#09090b",
        //     secondary: "#18181b",
        //     // light: "#F3C5C5",
        //   }, // dark theme colors
        // }, // ... custom themes
        light: {
          colors: {
            primary: {
              50: "#e0e0e1",
              100: "#b5b5b6",
              200: "#8a8a8b",
              300: "#5f5f60",
              400: "#343436",
              500: "#09090b",
              600: "#070709",
              700: "#060607",
              800: "#040405",
              900: "#030303",
              foreground: "#fff",
              DEFAULT: "#09090b",
            },
            secondary: {
              50: "#fefdfc",
              100: "#fbf9f7",
              200: "#f9f6f3",
              300: "#f7f2ee",
              400: "#f5efea",
              500: "#f3ebe5",
              600: "#c8c2bd",
              700: "#9e9995",
              800: "#73706d",
              900: "#494745",
              foreground: "#000",
              DEFAULT: "#f3ebe5",
            },
            success: {
              50: "#e2f8ec",
              100: "#b9efd1",
              200: "#91e5b5",
              300: "#68dc9a",
              400: "#40d27f",
              500: "#17c964",
              600: "#13a653",
              700: "#0f8341",
              800: "#0b5f30",
              900: "#073c1e",
              foreground: "#000",
              DEFAULT: "#17c964",
            },
            warning: {
              50: "#fef4e4",
              100: "#fce4bd",
              200: "#fad497",
              300: "#f9c571",
              400: "#f7b54a",
              500: "#f5a524",
              600: "#ca881e",
              700: "#9f6b17",
              800: "#744e11",
              900: "#4a320b",
              foreground: "#000",
              DEFAULT: "#f5a524",
            },
            danger: {
              50: "#f6e3e3",
              100: "#eabbbb",
              200: "#de9393",
              300: "#d26b6b",
              400: "#c54444",
              500: "#b91c1c",
              600: "#991717",
              700: "#781212",
              800: "#580d0d",
              900: "#380808",
              foreground: "#fff",
              DEFAULT: "#b91c1c",
            },
            background: "#FBF8F6",
            foreground: "#000000",
            content1: {
              DEFAULT: "#ffffff",
              foreground: "#000",
            },
            content2: {
              DEFAULT: "#f4f4f5",
              foreground: "#000",
            },
            content3: {
              DEFAULT: "#e4e4e7",
              foreground: "#000",
            },
            content4: {
              DEFAULT: "#d4d4d8",
              foreground: "#000",
            },
            focus: "#006FEE",
            overlay: "#000000",
          },
        },
        dark: {
          colors: {
            primary: {
              50: "#fefefe",
              100: "#fcfcfc",
              200: "#fafafa",
              300: "#f8f8f9",
              400: "#f6f6f7",
              500: "#f4f4f5",
              600: "#c9c9ca",
              700: "#9f9f9f",
              800: "#747474",
              900: "#49494a",
              foreground: "#000",
              DEFAULT: "#f4f4f5",
            },
            secondary: {
              50: "#e4e4e4",
              100: "#bebebf",
              200: "#98989a",
              300: "#737375",
              400: "#4d4d4f",
              500: "#27272a",
              600: "#202023",
              700: "#19191b",
              800: "#131314",
              900: "#0c0c0d",
              foreground: "#fff",
              DEFAULT: "#27272a",
            },
            success: {
              50: "#e2f8ec",
              100: "#b9efd1",
              200: "#91e5b5",
              300: "#68dc9a",
              400: "#40d27f",
              500: "#17c964",
              600: "#13a653",
              700: "#0f8341",
              800: "#0b5f30",
              900: "#073c1e",
              foreground: "#000",
              DEFAULT: "#17c964",
            },
            warning: {
              50: "#fef4e4",
              100: "#fce4bd",
              200: "#fad497",
              300: "#f9c571",
              400: "#f7b54a",
              500: "#f5a524",
              600: "#ca881e",
              700: "#9f6b17",
              800: "#744e11",
              900: "#4a320b",
              foreground: "#000",
              DEFAULT: "#f5a524",
            },
            danger: {
              50: "#f6e3e3",
              100: "#eabbbb",
              200: "#de9393",
              300: "#d26b6b",
              400: "#c54444",
              500: "#b91c1c",
              600: "#991717",
              700: "#781212",
              800: "#580d0d",
              900: "#380808",
              foreground: "#fff",
              DEFAULT: "#b91c1c",
            },
            background: "#000000",
            foreground: "#ffffff",
            content1: {
              DEFAULT: "#18181b",
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
    }),
  ],
};
