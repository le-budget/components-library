// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import vue from "eslint-plugin-vue";
import storybook from "eslint-plugin-storybook";
import tsParser from "@typescript-eslint/parser";
import vueParser from "vue-eslint-parser";

export default [{
  ignores: [
    "dist/**",
    "node_modules/**",
    ".yarn/**",
    "storybook-static/**",
    "coverage/**"
  ]
}, {
  files: ["**/*.ts", "**/*.vue"],
  languageOptions: {
    parser: vueParser,
    parserOptions: {
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: "module"
    }
  },
  plugins: {
    vue,
    storybook
  },
  rules: {
    ...vue.configs["flat/recommended"].rules,
    "storybook/no-renderer-packages": "error"
  }
}, ...storybook.configs["flat/recommended"]];
