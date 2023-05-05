/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", 'sans-serif'],
        montserratBold: ["Montserrat-Bold", 'sans-serif'],
        montserratLight: ["Montserrat-Light", 'sans-serif'],
        montserratMedium: ["Montserrat-Medium", 'sans-serif'],
      }
    },
  },
  plugins: [],
}

