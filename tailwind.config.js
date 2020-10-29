module.exports = {
  purge: [
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      height: {
        screen: 'calc(var(--vh, 1vh) * 100);',
      },
      minHeight: {
        screen: 'calc(var(--vh, 1vh) * 100);',
      },
    },
  },
  variants: {},
  plugins: [],
};
