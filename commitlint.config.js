module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'chore', 'test', 'ci', 'dx', 'refactor', 'docs'],
    ],
    'scope-enum': [
      2,
      'always',
      [
        'auth', 'posts', 'todos', 'navigation', 'theme', 'forms',
        'animations', 'realtime', 'webview', 'notifications', 'performance',
        'offline', 'analytics', 'a11y', 'i18n', 'storage', 'native', 'ci', 'dx',
      ],
    ],
  },
};
