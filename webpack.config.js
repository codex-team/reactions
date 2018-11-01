module.exports = {
  entry: './src/index.js',
  output: {
    filename: './reactions.js',
    library: 'Reactions',
    libraryTarget: 'umd'
  },
    module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.ts$/,
        use: [
          'ts-loader',
        ]
      }
    ]
  }
};
