const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
// 清除目录等
const CleanWebpackPlugin = require('clean-webpack-plugin');

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const webpackConfigBase = require('./webpack.base.conf');

const webpackConfigProd = {
  mode: 'production', // 通过 mode 声明生产环境
  devtool: 'none',
  plugins: [
    //删除dist目录
    new CleanWebpackPlugin(['dist'], {
      root: path.resolve(__dirname, '../'), //根目录
      // verbose Write logs to console.
      verbose: true, //开启在控制台输出信息
      // dry Use boolean "true" to test/emulate delete. (will not remove files).
      // Default: false - remove files
      dry: false,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"',
    }),
    //压缩css
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true,
      },
    }),
    //上线压缩 去除console等信息webpack4.x之后去除了webpack.optimize.UglifyJsPlugin
    new UglifyJSPlugin({
      include: /\/src/,
      parallel: true,
      uglifyOptions: {
        compress: {
          // 在UglifyJs删除没有用到的代码时不输出警告
          warnings: false,
          // 删除所有的 `console` 语句，可以兼容ie浏览器
          drop_console: true,
          // 内嵌定义了但是只用到一次的变量
          collapse_vars: true,
          // 提取出出现多次但是没有定义成变量去引用的静态值
          reduce_vars: true,
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
  module: {
    rules: [],
  },
};
module.exports = merge(webpackConfigBase, webpackConfigProd);
