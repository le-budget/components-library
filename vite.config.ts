import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "node:path";

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "BudgetComponents",
      fileName: "index",
      formats: ["es"]
    },
    cssCodeSplit: false,
    rollupOptions: {
      external: [
        "vue",
        "@fortawesome/fontawesome-svg-core",
        "@fortawesome/free-solid-svg-icons",
        "@fortawesome/free-regular-svg-icons",
        "@fortawesome/free-brands-svg-icons",
        "@fortawesome/vue-fontawesome"
      ]
    }
  }
});
