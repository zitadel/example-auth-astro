module.exports = {
  entry: [
    'src/entry-*',
    'src/app.tsx',
    'app.config.*',
    'src/routes/**/*',
    'src/components/**/*',
    'src/lib/**/*',
  ],
  ignore: ['app.config.timestamp_*.js'],
  ignoreDependencies: ['tailwindcss'],
};
