import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/config/setup.js"],
    testMatch: ["./tests/**/*.test.jsx$?"],
    globals: true,
    coverage: {
      provider: "v8", // or 'c8'
      reporter: ["text", "json", "html"], // or other reporters you prefer
      exclude: [
        "postcss.config.js",
        "tailwind.config.js",
        "src/main.jsx",
        ".eslintrc.cjs",
        // Add more patterns to exclude other files
      ],
    },
    exclude: ["**/node_modules/**", "**/*.config.js"],
  },
});
