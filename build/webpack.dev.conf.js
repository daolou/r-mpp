const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const webpackConfigBase = require('./webpack.base.conf');
const Dashboard = require('webpack-dashboard');
const DashboardPlugin = require('webpack-dashboard/plugin');
const dashboard = new Dashboard();

const webpackConfigDev = {
  mode: 'development', // 通过 mode 声明开发环境
  devServer: {
    contentBase: path.join(__dirname, '../src'),
    publicPath: '/', // 与上下文(output的publicPath)的保持一致
    host: '127.0.0.1',
    port: '8090',
    compress: false, // 不压缩
    overlay: true, // 浏览器页面上显示错误
    // open: true, // 开启浏览器
    // stats: "errors-only", //stats: "errors-only"表示只打印错误：
    hot: true, // 开启热更新
    quiet: true,
    disableHostCheck: true,
    historyApiFallback: true,
    //服务器代理配置项
    proxy: {
      '/test/*': {
        target: '',
        // secure: true,
        changeOrigin: true,
      },
    },
  },
  plugins: [
    //热更新
    new webpack.HotModuleReplacementPlugin(),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"',
    }),

    new DashboardPlugin(dashboard.setData),
  ],
  devtool: 'source-map', // 开启调试模式
  module: {
    rules: [],
  },
};
module.exports = merge(webpackConfigBase, webpackConfigDev);
