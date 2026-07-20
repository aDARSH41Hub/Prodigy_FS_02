/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#F6F7FA",
        surface: "#FFFFFF",
        ink: "#1B1F27",
        muted: "#6B7280",
        line: "#E4E7EC",
        accent: {
          DEFAULT: "#3454D1",
          dark: "#28409E",
          light: "#EEF1FD",
        },
        danger: {
          DEFAULT: "#D64545",
          light: "#FBEAEA",
        },
        success: {
          DEFAULT: "#1F9D55",
          light: "#E8F7EE",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
