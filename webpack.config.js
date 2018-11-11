
module.exports = {
  entry: './src/index.ts',
  output: {
    filename: './reactions.js',
    library: 'Reactions',
    libraryTarget: 'umd',
    libraryExport: 'default'
  },
    module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader'
          }
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
