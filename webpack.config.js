const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const PATHS = {
  src: path.join(__dirname, './src'),
  dist: path.join(__dirname, './docs'),
  assets: 'assets/',
};

module.exports = {
  devtool: 'source-map',
  entry: './src/index.ts',
  output: {
    filename: 'script.js',
    path: PATHS.dist,
  },
  resolve: {
    extensions: ['.ts', '.less', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
        },
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: PATHS.dist,
              hmr: process.env.NODE_ENV === 'development',
            },
          },
          {
            loader: 'css-loader',
            options: {
              url: false,
            },
          },
          {
            loader: 'less-loader',
          },
        ],
      },
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  devServer: {
    overlay: true,
    contentBase: './src'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([{ from: PATHS.src + '/assets', to: PATHS.dist + '/assets' }]),
    new MiniCssExtractPlugin({
      filename: 'style.css',
      chunkFilename: '[id].css',
      ignoreOrder: false,
    }),
  ],
};
