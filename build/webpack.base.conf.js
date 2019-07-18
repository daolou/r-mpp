const path = require('path');
const webpack = require('webpack');
const glob = require('glob');
const fs = require('fs');
const chalk = require('chalk');

// require("./env-config");
const paths = require('./paths');
const isDev = process.env.NODE_ENV == 'development';

//消除冗余的css
const PurgecssPlugin = require('purgecss-webpack-plugin');
// 分离css
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// px转rem
// const px2rem = require('postcss-plugin-px2rem');
// html模板
const HtmlWebpackPlugin = require('html-webpack-plugin');
//静态资源输出
const CopyWebpackPlugin = require('copy-webpack-plugin');
// 打包进度条
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

const rules = require('./webpack.rules.conf.js');

const getTemplate = function() {
  let pathTemp = paths.defaultTemp;
  if (!fs.existsSync(pathTemp)) {
    pathTemp = paths.currentTemp;
  }
  return pathTemp;
};

module.exports = {
  entry: {
    app: paths.entry,
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: isDev ? 'js/[name].js' : 'js/[name].[chunkhash:6].js',
    publicPath: paths.public,
  },
  module: {
    rules: [...rules],
  },
  // postcss: [px2rem({})],
  resolve: {
    alias: {
      '~src': path.resolve(__dirname, '../src'),
      '~config': path.resolve(__dirname, '../config'),
      '~build': path.resolve(__dirname, '../build'),
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
          test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|fastclick|(\@babel)|core-js)[\\/]/, // 指定是node_modules下的第三方包
          chunks: 'initial',
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
          chunks: 'initial',
          name: 'commons', // 任意命名
          minSize: 0, // 只要超出0字节就生成一个新包
          minChunks: 2,
        },
      },
    },
  },
  plugins: [
    // 全局暴露统一入口
    new webpack.ProvidePlugin({}),
    // 打包进度条
    new ProgressBarPlugin({
      format:
        '   ' +
        chalk.blue.bold('build') +
        ' [:bar] ' +
        chalk.green.bold(':percent') +
        ' (:elapsed seconds)',
      clear: false,
    }),
    //静态资源输出
    new CopyWebpackPlugin([
      {
        from: paths.assets,
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
      filename: isDev ? 'css/[id].[name].css' : 'css/[id].[name].[contenthash:6].css',
      // chunkFilename: isDev ? 'css/[id].css' : 'css/[id].[contenthash:6].css',
    }),
    new HtmlWebpackPlugin({
      template: getTemplate(),
      templateParameters: { data: paths.data },
      filename: `index.html`,
      // favicon: './favicon.ico',
      // title: title,
      inject: true,
      hash: !isDev, //开启hash  ?[hash]
      chunks: ['app', 'vendor', 'commons', 'manifest'],
      minify: isDev
        ? false
        : {
            removeComments: true, // 移除HTML中的注释
            collapseWhitespace: true, // 删除空白符与换行符
            minifyJS: true,
          },
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
  ],
};
