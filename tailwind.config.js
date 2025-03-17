/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        dotsBounce: "dotsBounce 2s ease-in-out infinite",
        dotBounceDelay: "dotsBounce 2s linear infinite 0.5s",
      },
      keyframes: {
        dotsBounce: {
          "0%, 100%": {
            transform: "scale(0.2)",
          },
          "50%": {
            transform: "scale(1)",
          },
        },
      },
      colors: {
        primary: "#1362fb",
        secondary: "#233558",
        borderColor: "#d3d0d0",
        textColor: "#2b2e27",
        hoverPrimary: "#2a6da5",
        delete: "#ef4444",
        danger: "#ef4444",
      },

      backgroundColor: {
        primary: "#2f7bb9e6",
        hoverPrimary: "#2f7bb9",
        secondary: "#e6e6e6e6",
        hoverSecondary: "#e6e6e6",
      },

      fontFamily: {
        poppins: "Poppins,sans-serif",
      },
    },
  },
  plugins: [],
};
