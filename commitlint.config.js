export default {
  extends: ['@commitlint/config-conventional'],
  plugins: [
    {
      rules: {
        'body-min-lines': ({ body }) => {
          const lines = (body ?? '').split('\n').filter((l) => l.trim() !== '');
          return [lines.length >= 2, 'body must have at least 2 non-empty lines'];
        },
      },
    },
  ],
  rules: {
    'subject-empty': [2, 'never'],
    'body-empty': [2, 'never'],
    'body-min-lines': [2, 'always'],
    'header-max-length': [2, 'always', 50],
    'body-max-line-length': [2, 'always', 72],
    'subject-case': [0],
  },
};
