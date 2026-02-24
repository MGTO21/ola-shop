import type { Config } from "tailwindcss"

const config: Config = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Ola Shop Brand Colors
                primary: {
                    DEFAULT: "#880E4F", // Maroon
                    50: "#FCE4EC",
                    100: "#F8BBD0",
                    200: "#F48FB1",
                    300: "#F06292",
                    400: "#EC407A",
                    500: "#880E4F",
                    600: "#AD1457",
                    700: "#C2185B",
                    800: "#D81B60",
                    900: "#E91E63",
                },
                secondary: {
                    DEFAULT: "#00838F", // Teal
                    50: "#E0F2F1",
                    100: "#B2DFDB",
                    200: "#80CBC4",
                    300: "#4DB6AC",
                    400: "#26A69A",
                    500: "#00838F",
                    600: "#00897B",
                    700: "#00796B",
                    800: "#00695C",
                    900: "#004D40",
                },
                accent: {
                    DEFAULT: "#EF6C00", // Orange
                    50: "#FFF3E0",
                    100: "#FFE0B2",
                    200: "#FFCC80",
                    300: "#FFB74D",
                    400: "#FFA726",
                    500: "#EF6C00",
                    600: "#FB8C00",
                    700: "#F57C00",
                    800: "#EF6C00",
                    900: "#E65100",
                },
                purple: {
                    DEFAULT: "#7B1FA2",
                    50: "#F3E5F5",
                    100: "#E1BEE7",
                    200: "#CE93D8",
                    300: "#BA68C8",
                    400: "#AB47BC",
                    500: "#7B1FA2",
                    600: "#8E24AA",
                    700: "#7B1FA2",
                    800: "#6A1B9A",
                    900: "#4A148C",
                },
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            fontFamily: {
                sans: ["var(--font-poppins)", "sans-serif"],
                serif: ["var(--font-playfair)", "serif"],
                arabic: ["var(--font-cairo)", "sans-serif"],
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
}

export default config
