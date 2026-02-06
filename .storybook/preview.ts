import type { Preview } from "@storybook/vue3-vite";
import { withThemeByClassName } from "@storybook/addon-themes";
import "../src/styles/tailwind.css";

const preview: Preview = {
  decorators: [
    withThemeByClassName({
      themes: {
        light: "",
        dark: "dark"
      },
      defaultTheme: "light",
      parentSelector: "html"
    })
  ],
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  },

  tags: ["autodocs"]
};

export default preview;
