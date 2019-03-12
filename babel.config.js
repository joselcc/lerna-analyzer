module.exports = api => {
  api.cache(true);
  return {
    // babelrc: false,
    compact: false,
    minified: false,
    comments: true,
    presets: [
      require.resolve('@babel/preset-react'),
      require.resolve('@babel/preset-env')
    ],
    plugins: [require.resolve('babel-plugin-transform-class-properties')]
  };
};
