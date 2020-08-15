const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
var ManifestPlugin = require("webpack-manifest-plugin");

module.exports = {
  mode: "development",
  watchOptions: {
    aggregateTimeout: 600,
  },
  entry: {
    home: ["./home/static/src/scss/home.scss", "./home/static/src/js/home.js"],
    product: ["./home/static/src/scss/product.scss"],
    globals: ["./static/src/scss/globals.scss"],
  },
  plugins: [
    new webpack.HashedModuleIdsPlugin(),
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
    }),
    new CopyPlugin([
      {
        from: "./static/src/images",
        to: path.resolve(__dirname, "dist/images"),
      },
    ]),
    new ManifestPlugin(),
  ],
  output: {
    path: path.resolve(__dirname, "static/dist"),
    filename: "js/[name].[contenthash:8].js",
  },
  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "[name].[contenthash].[ext]",
            outputPath: "assets/fonts/",
            publicPath: "assets/fonts/",
          },
        },
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "/css/[name].[contenthash:8].css",
            },
          },
          {
            loader: "extract-loader",
          },
          {
            loader: "css-loader?-url",
          },
          {
            loader: "postcss-loader",
          },
          {
            loader: "sass-loader",
          },
        ],
      },
    ],
  },
};