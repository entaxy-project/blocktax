const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');

dotenv.config();

// Copy manifest.json to the path: 'public/build'
// this will allow for the authRequest to see the file at www.example.com/manifest.json
const CopyWebpackPlugin = require('copy-webpack-plugin');

const ManifestAssetPlugin = new CopyWebpackPlugin([{from: 'src/assets/manifest.json', to: 'manifest.json'}]);
const IconAssetPlugin = new CopyWebpackPlugin([{from: 'src/images/icon-192x192.png', to: 'icon-192x192.png'}]);

const HtmlWebpackPlugin = require('html-webpack-plugin');

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './src/index.html',
  filename: 'index.html',
  inject: 'body'
});

const DefinePlugin = new webpack.DefinePlugin({
  'process.env.BASE_URL': JSON.stringify(process.env.BASE_URL),
  'process.env.COINBASE_API_ID': JSON.stringify(process.env.COINBASE_API_ID),
  'process.env.COINBASE_API_SECRET': JSON.stringify(process.env.COINBASE_API_SECRET)
});

module.exports = {
  entry: ['babel-polyfill', './src/index.js'],
  target: 'web',
  output: {
    path: path.resolve('public/build'),
    filename: 'index_bundle.js'
  },
  devServer: {
    historyApiFallback: true,
    watchOptions: {aggregateTimeout: 300, poll: 1000},
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    }
  },
  devtool: 'source-map',
  module: {
    rules: [
      {test: /\.json$/, use: 'json-loader'},
      {test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/},
      {test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/},
      {
        test: /\.(eot|woff|woff2|ttf|svg|png|jpe?g|gif)(\?\S*)?$/,
        loader: 'file-loader'
      },
      {test: /\.css$/, loader: 'style-loader!css-loader'}
    ]
  },
  plugins: [HtmlWebpackPluginConfig, ManifestAssetPlugin, IconAssetPlugin, DefinePlugin]
};
