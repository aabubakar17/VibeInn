/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
  ],
  theme: {
    extend: {
      backgroundColor: {
        glass: "rgba(255, 255, 255, 0.15)",
      },
      backdropBlur: {
        none: "0",
        sm: "4px",
        md: "12px",
        lg: "24px",
        xl: "40px",
      },
      boxShadow: {
        glass: "0 4px 6px 0 rgba(31, 38, 135, 0.37)",
      },
      borderColor: {
        glass: "rgba(255, 255, 255, 0.18)",
      },
    },
  },
  plugins: ["tailwindcss-filters"],
};
