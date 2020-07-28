const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const portfinder = require('portfinder');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const webpackConfigBase = require('./webpack.base.conf');
const getIP = require('./helper/getIP');

// const Dashboard = require('webpack-dashboard');
// const DashboardPlugin = require('webpack-dashboard/plugin');
// const dashboard = new Dashboard();

const webpackConfigDev = {
  mode: 'development', // 通过 mode 声明开发环境
  devtool: 'cheap-module-eval-source-map', // 开启调试模式
  devServer: {
    contentBase: path.join(__dirname, '../src'),
    publicPath: '/', // 与上下文(output的publicPath)的保持一致
    host: '0.0.0.0',
    port: '8090',
    compress: true, // 压缩
    overlay: true, // 浏览器页面上显示错误
    // open: true, // 开启浏览器
    // stats: 'errors-only', //stats: "errors-only"表示只打印错误：
    clientLogLevel: 'error',
    hot: true, // 开启热更新
    // hotOnly: true,
    noInfo: true,
    // quiet: true,
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
  optimization: {
    //在开发环境中加，生产环境不加
    usedExports: true,
  },
  plugins: [
    //热更新
    new webpack.HotModuleReplacementPlugin(),

    // new DashboardPlugin(dashboard.setData),
  ],
  module: {
    rules: [
      {
        test: /\.(le|c)ss$/,
        use: [
          'style-loader',
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
                  // unitPrecision: 5,
                }),
              ],
            },
          },
          'less-loader',
        ],
      },
    ],
  },
};

const mergedConfig = merge(webpackConfigBase, webpackConfigDev);

portfinder.basePort = mergedConfig.devServer.port;

module.exports = portfinder
  .getPortPromise()
  .then(port => {
    mergedConfig.devServer.port = port;
    mergedConfig.plugins.push(
      new FriendlyErrorsWebpackPlugin({
        compilationSuccessInfo: {
          messages: [`You application is running at http://${getIP()}:${port}`],
        },
        clearConsole: true,
      })
    );
    return mergedConfig;
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
