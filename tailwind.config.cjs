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
        "c-blue": "#1C84C6",
        "c-green": "#30B7AC",
        "c-orange": "#F8AC59"
      }
    }
  },
  plugins: []
};
