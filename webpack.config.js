
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
          {
            loader: 'css-loader', 
            options: {
              importLoaders: 1
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              config: './'
            }
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
