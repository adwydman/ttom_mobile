module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            components: './src/components',
            shared: './src/shared',
            screens: './src/screens',
            assets: './src/assets',
            utils: './src/utils',
            stores: './src/stores'
          },
        },
      ],
    ],
  };
};
''
