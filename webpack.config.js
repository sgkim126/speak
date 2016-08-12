module.exports = {
  entry: './src/main.ts',
  module: {
    loaders: [
      { test: /\.ts[x]?$/, loader: 'babel-loader?presets[]=es2015&presets[]=react!ts-loader' }
    ]
  },
  output: {
    filename: 'speak.js'
  },
  target: 'web'
}
