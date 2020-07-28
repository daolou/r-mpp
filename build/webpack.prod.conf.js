const { resolve } = require('path');
// const glob = require('glob');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const LogFilesizeWebpackPlugin = require('@jsany/log-filesize-webpack-plugin');
const webpackConfigBase = require('./webpack.base.conf');

const webpackConfigProd = {
  mode: 'production', // 通过 mode 声明生产环境
  // devtool: 'cheap-module-source-map',
  stats: 'none',
  plugins: [
    //删除dist目录
    new CleanWebpackPlugin(['dist'], {
      root: resolve(__dirname, '../'), //根目录
      // verbose Write logs to console.
      verbose: true, //开启在控制台输出信息
      // dry Use boolean "true" to test/emulate delete. (will not remove files).
      // Default: false - remove files
      dry: false,
    }),
    //压缩css
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true,
      },
    }),
    // 分离css
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'css/[id].[name].[contenthash:6].css',
      chunkFilename: 'css/[id].[contenthash:6].css',
    }),
    new LogFilesizeWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.(le|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true,
              localIdentName: '[local]_[hash:base64:5]',
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                require('autoprefixer')({
                  overrideBrowserslist: ['last 10 versions'],
                }),
                require('postcss-plugin-px2rem')({
                  exclude: /node_modules/,
                }),
              ],
            },
          },
          'less-loader',
        ],
      },
    ],
  },
  optimization: {
    //上线压缩 去除console等信息webpack4.x之后去除了webpack.optimize.UglifyJsPlugin
    minimizer: [
      new TerserPlugin({
        exclude: /node_modules/,
        test: /\.js(\?.*)?$/i,
        parallel: true,
        extractComments: false,
        terserOptions: {
          // 兼容ie浏览器
          ie8: true,
          // 在UglifyJs删除没有用到的代码时不输出警告
          warnings: false,
          compress: {
            // 内嵌定义了但是只用到一次的变量
            collapse_vars: true,
            // 提取出出现多次但是没有定义成变量去引用的静态值
            reduce_vars: true,
            // 删除所有的 `console` 语句
            pure_funcs: String(process.env.STAGING) === '1' ? [] : ['console.log', 'console.error'],
          },
          output: {
            // 最紧凑的输出
            beautify: false,
            // 删除所有的注释
            comments: false,
          },
        },
      }),
    ],
  },
};

module.exports = merge(webpackConfigBase, webpackConfigProd);
