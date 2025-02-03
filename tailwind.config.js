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
      },
      fontFamily: {
        poppins: "Poppins,sans-serif",
      },
    },
  },
  plugins: [],
};
