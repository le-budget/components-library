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
        "c-blue": "#1C84C6",
        "c-blue-dark": "#196FAB",
        "c-blue-light": "#4EA0D6",
        "c-green": "#30B7AC",
        "c-green-dark": "#27988F",
        "c-green-light": "#5CC7BE",
        "c-orange": "#F8AC59",
        "c-orange-dark": "#DE964F",
        "c-orange-light": "#F9C17C"
      }
    }
  },
  plugins: []
};
