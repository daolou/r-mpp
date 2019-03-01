const path = require('path');
const webpack = require('webpack');
const glob = require('glob');
const fs = require('fs');

// require("./env-config");
const projectConfig = require('../config/projectConfig');
const isDev = process.env.NODE_ENV == 'development';

//消除冗余的css
const PurgecssPlugin = require('purgecss-webpack-plugin');
// 分离css
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// html模板
const HtmlWebpackPlugin = require('html-webpack-plugin');
//静态资源输出
const CopyWebpackPlugin = require('copy-webpack-plugin');
const rules = require('./webpack.rules.conf.js');

const getTemplate = function() {
  let pathTemp = `${projectConfig.localPath}/document.html`;
  if (!fs.existsSync(pathTemp)) {
    pathTemp = path.resolve(projectConfig.localPath, '../', './document.html');
  }
  return pathTemp;
};

module.exports = {
  entry: {
    app: projectConfig.localPath + 'app.js',
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: isDev ? './js/[name].js' : './js/[name].[hash].js',
    publicPath: isDev ? '/' : './',
  },
  module: {
    rules: [...rules],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src'),
    },
  },
  //将外部变量或者模块加载进来
  externals: {
    // 'jquery': 'window.jQuery'
  },
  // 提取公共代码
  optimization: {
    runtimeChunk: { name: 'manifest' },
    splitChunks: {
      cacheGroups: {
        vendor: {
          // 抽离第三方插件
          /*eslint no-useless-escape: "off"*/
          test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|react-redux|redux|redux-saga|umi|dva|dva-core|dva-loading|(\@babel)|core-js)[\\/]/, // 指定是node_modules下的第三方包
          chunks: 'all',
          name: 'vendor', // 打包后的文件名，任意命名
          // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
          priority: 10,
        },
        // icons: {
        //   name: 'icons',
        //   chunks: 'all',
        //   test: /[\\/]node_modules[\\/](@ant-design)[\\/]/,
        // },
        commons: {
          // 抽离自己写的公共代码，common这个名字可以随意起
          chunks: 'async',
          name: 'commons', // 任意命名
          minSize: 1, // 只要超出0字节就生成一个新包
          minChunks: 2,
        },
      },
    },
  },
  plugins: [
    // 全局暴露统一入口
    new webpack.ProvidePlugin({}),
    //静态资源输出
    new CopyWebpackPlugin([
      {
        from: path.resolve(projectConfig.localPath, './assets'),
        to: './assets',
        ignore: ['.*'],
      },
      {
        from: path.resolve(__dirname, '../src/public'),
        to: './',
        ignore: ['.*'],
      },
    ]),
    // 消除冗余的css代码
    new PurgecssPlugin({
      paths: glob.sync(path.join(__dirname, '../src/**/*'), { nodir: true }),
    }),
    // 分离css
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: isDev ? 'css/[name].css' : 'css/[name].[hash].css',
      chunkFilename: isDev ? 'css/[id].css' : 'css/[id].[hash].css',
    }),
    new HtmlWebpackPlugin({
      template: getTemplate(),
      filename: `index.html`,
      // favicon: './favicon.ico',
      // title: title,
      inject: true,
      hash: isDev, //开启hash  ?[hash]
      chunks: ['app', 'vendor', 'commons', 'manifest'],
      minify: isDev
        ? false
        : {
            removeComments: true, //移除HTML中的注释
            collapseWhitespace: true, //折叠空白区域 也就是压缩代码
            removeAttributeQuotes: true, //去除属性引用
          },
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
  ],
};
