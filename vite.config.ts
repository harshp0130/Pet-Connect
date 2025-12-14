import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { copyFileSync } from "fs"; // ✅ add this

export default defineConfig(({ mode }) => ({
  base: "/",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    
    // ✅ Plugin to copy _redirects after build
    {
      name: "copy-redirects",
      closeBundle() {
        try {
          copyFileSync("public/_redirects", "dist/_redirects");
          console.log("✅ _redirects file copied to dist/");
        } catch (err) {
          console.error("❌ Failed to copy _redirects:", err);
        }
      },
    },
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
