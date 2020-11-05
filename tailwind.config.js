const flattenColorPalette = require('tailwindcss/lib/util/flattenColorPalette')
  .default;
const escapeClassName = require('tailwindcss/lib/util/escapeClassName').default;
const toColorValue = require('tailwindcss/lib/util/toColorValue').default;
const plugin = require('tailwindcss/plugin');

const color = require('color');

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
  variants: {
    boxShadow: ['responsive', 'hover', 'focus', 'focus-within'],
  },
  plugins: [
    plugin(({ addUtilities, theme, variants }) => {
      const colors = flattenColorPalette(theme('colors'));

      const utilities = Object.fromEntries(
        Object.entries(colors)
          .filter(
            ([, value]) => value !== 'currentColor' && value !== 'transparent'
          )
          .flatMap(([modifier, value]) => {
            const shadowColor = color(toColorValue(value)).fade(0.4).string();
            return [
              [
                `.glow-${escapeClassName(modifier)}`,
                {
                  'box-shadow': `0 0 0.5rem ${shadowColor}`,
                },
              ],
              [
                `.glow-${escapeClassName(modifier)}-md`,
                {
                  'box-shadow': `0 0 0.75rem ${shadowColor}`,
                },
              ],
            ];
          })
      );

      addUtilities(utilities, variants('boxShadow'));
    }),
  ],
};
