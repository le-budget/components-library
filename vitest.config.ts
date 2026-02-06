import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: "jsdom",
    globals: true,
    include: ["tests/**/*.spec.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      lines: 100,
      branches: 100,
      functions: 100,
      statements: 100,
      exclude: [
        "dist/**",
        "stories/**",
        "docs/**",
        "tests/**",
        "eslint.config.js",
        "env.d.ts",
        "vite.config.ts",
        "vitest.config.ts",
        ".storybook/main.ts",
        ".storybook/preview.ts",
        "postcss.config.cjs",
        "tailwind.config.cjs",
        "src/index.ts"
      ]
    }
  }
});
