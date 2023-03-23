module.exports = api => {
  const babelEnv = api.env();
  const plugins = ['react-native-reanimated/plugin'];
  if (babelEnv !== 'development') {
    plugins.push('transform-remove-console');
  }
  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins,
  };
};
