module.exports = {
  entry: './src/index.js',
  output: {
    filename: './reactions.js'
  },
    module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  }
};
