const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const path = require('path')

const common = {
  nodeEnv: new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: `'development'`,
    },
  }),
  path: path.resolve(__dirname, 'dist'),
  publicPath: '/',
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    },
  ],
  resolve: { extensions: ['.js'] },
}

module.exports = (env, argv = {}) => ({
    target: 'node',
    entry: {
      server: './src/server/server.js',
    },
    output: {
      path: common.path,
      filename: '[name].js',
      publicPath: common.publicPath,
      libraryTarget: 'commonjs2',
    },
    externals: [nodeExternals()],
    resolve: common.resolve,
    module: {
      rules: common.rules,
    },
  })