'use strict'

const path = require('path')
const webpack = require('webpack')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'development',//'production',
  devtool: 'source-map',
  entry: [
    './index.js'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.[contenthash].js'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'ipfsify',
      template: 'index.html'
    }),
    // fixes Module not found: Error: Can't resolve 'stream' in '.../node_modules/nofilter/lib'
    new NodePolyfillPlugin(),
    // Note: stream-browserify has assumption about `Buffer` global in its
    // dependencies causing runtime errors. This is a workaround to provide
    // global `Buffer` until https://github.com/isaacs/core-util-is/issues/29
    // is fixed.
    /*new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser'
    })*/
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        // Use multi-process parallel running to improve the build speed
        // Default number of concurrent runs: os.cpus().length - 1
        parallel: true,
      }),
    ],
  },
}
