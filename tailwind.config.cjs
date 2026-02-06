module.exports = {
  content: [
    "./src/**/*.{ts,vue}",
    "./stories/**/*.{ts,vue}",
    "./docs/**/*.md"
  ],
  theme: {
    extend: {
      colors: {
        "c-red": "#ED5565",
        "c-red-dark": "#D14B59",
        "c-red-light": "#F27A86",
        "c-red-active": "#F06B78",
        "c-blue": "#1C84C6",
        "c-blue-dark": "#196FAB",
        "c-blue-light": "#4EA0D6",
        "c-blue-active": "#3B92D0",
        "c-green": "#30B7AC",
        "c-green-dark": "#27988F",
        "c-green-light": "#5CC7BE",
        "c-green-active": "#4AC1B6",
        "c-orange": "#F8AC59",
        "c-orange-dark": "#DE964F",
        "c-orange-light": "#F9C17C",
        "c-orange-active": "#F9B96F",
        "c-black": "#0F172A",
        "c-black-dark": "#111827",
        "c-black-light": "rgba(15, 23, 42, 0.12)",
        "c-black-active": "#1F2937",
        "c-black-success": "#0B3B2E",
        "c-black-success-dark": "#0A2F25",
        "c-black-warning": "#4A2B0E",
        "c-black-warning-dark": "#3D240C",
        "c-black-error": "#4A1418",
        "c-black-error-dark": "#3C1013"
      }
    }
  },
  plugins: []
};
