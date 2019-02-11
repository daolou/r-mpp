const path = require('path');
const webpack = require('webpack');
const glob = require('glob');
const fs = require('fs');

// require("./env-config");
const projectConfig = require('../config/projectConfig');
const isDev = process.env.NODE_ENV == 'development';

//消除冗余的css
const purifyCssWebpack = require('purifycss-webpack');
// html模板
const htmlWebpackPlugin = require('html-webpack-plugin');
//静态资源输出
const copyWebpackPlugin = require('copy-webpack-plugin');
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
    splitChunks: {
      cacheGroups: {
        vendor: {
          // 抽离第三方插件
          test: /node_modules/, // 指定是node_modules下的第三方包
          chunks: 'initial',
          name: 'vendor', // 打包后的文件名，任意命名
          // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
          priority: 10,
        },
        utils: {
          // 抽离自己写的公共代码，common这个名字可以随意起
          chunks: 'initial',
          name: 'common', // 任意命名
          minSize: 0, // 只要超出0字节就生成一个新包
          minChunks: 2,
        },
      },
    },
  },
  plugins: [
    // 全局暴露统一入口
    new webpack.ProvidePlugin({}),
    //静态资源输出
    new copyWebpackPlugin([
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
    new purifyCssWebpack({
      paths: glob.sync(path.join(__dirname, '../src/*.html')),
    }),
    new htmlWebpackPlugin({
      template: getTemplate(),
      filename: `index.html`,
      // favicon: './favicon.ico',
      // title: title,
      inject: true,
      hash: true, //开启hash  ?[hash]
      // chunks: chunks,
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
