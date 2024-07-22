/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false,
  },
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        primaryColor: 'var(--primary-color)',
        primaryColorText: 'var(--primary-color-text)',
      },
    },
  },
  plugins: [],
};
