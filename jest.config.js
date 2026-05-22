module.exports = {
  preset: '@react-native/jest-preset',
  setupFilesAfterEnv: ['./jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native[^/]*|@react-native|@react-navigation|react-native-nitro-modules)/)',
  ],
  resolver: '<rootDir>/node_modules/react-native-worklets/jest/resolver.js',
  moduleNameMapper: {
    '^react-native-worklets$': '<rootDir>/node_modules/react-native-worklets/lib/module/mock',
  },
};
