module.exports = {
  ignore: ['commitlint.config.js'],
  ignoreDependencies: ['@commitlint/config-conventional', '@zitadel/astro-auth'],
  entry: [
    'src/pages/**/*',
    'src/components/**/*',
    'src/layouts/**/*',
    'src/lib/**/*',
  ],
};
