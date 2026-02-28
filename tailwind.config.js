export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f5f7ff",
          100: "#e4e9ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
        surface: "#f8fafc",
        borderSoft: "#e5e7eb",
        darkSurface: "#0f172a",
      },
      boxShadow: {
        card: "0 10px 40px rgba(0,0,0,0.06)",
        soft: "0 4px 16px rgba(0,0,0,0.04)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
}