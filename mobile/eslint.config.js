// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', 'node_modules/*', '.expo/*'],
  },
  {
    // These four come from the React Compiler preset of eslint-plugin-react-hooks.
    // The app does not enable the compiler, so they only say "the compiler would
    // skip this component", which costs nothing here. The patterns they flag
    // (resetting state when an input changes, a latest-callback ref, reading
    // Date.now() for a value that is frozen before it is displayed) are
    // deliberate and covered by the quiz and checkout tests.
    rules: {
      'react-hooks/purity': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
    },
  },
]);
