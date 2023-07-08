module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        "module-resolver",
        {
          alias: {
            components: './src/components',
            shared: './src/shared',
            screens: './src/screens',
            drawers: './src/drawers',
            assets: './src/assets',
            utils: './src/utils',
            stores: './src/stores'
          },
        },
      ],
    ],
  };
};
