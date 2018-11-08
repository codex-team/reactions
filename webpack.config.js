module.exports = {
  entry: './src/example/index.ts',
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
