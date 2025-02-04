/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1362fb",
        secondary: "#233558",
        borderColor: "#d3d0d0",
        textColor: "#2b2e27",
        hoverPrimary: "#2a6da5",
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
