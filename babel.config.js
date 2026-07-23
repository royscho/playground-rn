module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': './src',
        },
      },
    ],
    'react-native-reanimated/plugin',
    // zod v4's ESM build uses `export * as core from './core/index.js'` —
    // Metro/Babel doesn't transform that syntax by default.
    '@babel/plugin-transform-export-namespace-from',
  ],
};
