// const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  entry: {
    main: './src/index.ts',
    // '../server': './server.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
        template: './src/index.html',   
        title: 'GRAPHON',
    }),
    // new CopyPlugin({
    //     patterns: [
    //       { from: "server.js", to: "../server.js" },
    //     ],
    // }),
  ],
  module: {
    rules: [
      {
        test: /\.ts(x)?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [
      '.tsx',
      '.ts',
      '.js'
    ]
  },
  devServer: {
    static: './dist',
  },
  mode: 'development'
};

module.exports = config;