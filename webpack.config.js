// const webpack = require('webpack');
const path = require('path');
// const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  entry: {
    main: './src/index.ts',
    "./workers/render-worker": './src/workers/render-worker.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
        template: './src/index.html',   
        title: 'GRAPHON',
    })
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