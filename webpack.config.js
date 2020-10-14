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
  target: 'web',
  entry: {
    client: './src/client/index.js',
  },
  output: {
    path: common.path,
    filename: '[name].js',
    publicPath: common.publicPath,
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './src/client/index.html',
      filename: './index.html',
    }),
    new CleanWebpackPlugin({ verbose: true }),
  ],
  // resolve: { extensions: ['.js'] },
  resolve: common.resolve,
  module: {
    rules: common.rules,
  },
  devtool: argv.mode === 'development' ? 'source-map' : false,
  devServer: {
    contentBase: common.path,
    publicPath: common.publicPath,
    open: true,
    historyApiFallback: true,
  },
})
  /*,
  (env, argv = {}) => ({
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
  })]
/*
module.exports = [
    {
        // client side rendering
        target: 'web',
        entry: {
            client: './src/client/index.js'
        },
        output: {
            path: common.path,
            filename: '[name].js',
            publicPath: common.publicPath
        },
        plugins: [
            common.nodeEnv,
            new HtmlWebPackPlugin({
                template: './src/client/index.html',
                filename: './index.html'
            })
        ],
        resolve: common.resolve,
        module: {
            loaders: common.loaders
        },
        devtool: 'source-map',
        devServer: {
            contentBase: common.path,
            publicPath: common.publicPath,
            open: true,
            historyApiFallback: true
        },
    },
    {
        // server side rendering
        target: 'node',
        entry: {
            server: './src/server/server.js'
        },
        output: {
            path: common.path,
            filename: '[name].js',
            publicPath: common.publicPath,
            libraryTarget: 'commonjs2',
        },
        externals: [nodeExternals()],
        plugins: [
            common.nodeEnv,
        ],
        resolve: common.resolve,
        module: {
            loaders: common.loaders
        }
    }
];*/