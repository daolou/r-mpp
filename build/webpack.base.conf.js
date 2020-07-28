const path = require('path');
const webpack = require('webpack');
const glob = require('glob');
const fs = require('fs');
const getIP = require('./helper/getIP');

// require("./env-config");
const projectConfig = require('../config/projectConfig');
const isDev = process.env.NODE_ENV == 'development';
// px转rem
// const px2rem = require('postcss-plugin-px2rem');
// html模板
const HtmlWebpackPlugin = require('html-webpack-plugin');
//静态资源输出
const CopyWebpackPlugin = require('copy-webpack-plugin');
// 打包进度条
const WebpackBar = require('webpackbar');

const getEntry = function() {
  const entry = {};
  glob.sync(`${projectConfig.localPath}pages/**/*.js`).forEach(function(name) {
    const start = projectConfig.localPath.length + 6;
    const end = name.length - 3;
    const key = name.substring(start, end);
    const values = [];
    values.push(name);
    entry[key] = values;
  });

  glob.sync(`${projectConfig.localPath}pages/**/*.tsx`).forEach(function(name) {
    const start = projectConfig.localPath.length + 6;
    const end = name.length - 4;
    const key = name.substring(start, end);
    const values = [];
    values.push(name);
    entry[key] = values;
  });
  // console.log(entry);
  return entry;
};
const getTemplate = function(filename) {
  if (!filename) {
    filename = 'document';
  }
  let pathTemp = `${projectConfig.localPath}/${filename}.njk`;
  if (!fs.existsSync(pathTemp)) {
    pathTemp = path.resolve(projectConfig.localPath, '../', `./${filename}.njk`);
  }
  return pathTemp;
};
const getHtmlConfig = function(name, template, only) {
  return {
    template: getTemplate(template),
    templateParameters: { data: projectConfig.data, extra: projectConfig.extra },
    filename: `${name}.html`,
    // favicon: './favicon.ico',
    // title: title,
    inject: true,
    hash: !isDev, //开启hash  ?[hash]
    chunks: only ? [name] : ['vendor', 'commons', 'manifest', name],
    minify: isDev
      ? false
      : {
          removeComments: true, // 移除HTML中的注释
          collapseWhitespace: true, // 删除空白符与换行符
          minifyJS: true,
        },
  };
};

const entryObj = getEntry();
const htmlArr = [];
Object.keys(entryObj).forEach(name => {
  htmlArr.push(new HtmlWebpackPlugin(getHtmlConfig(name)));
});
const copyArr = [];

copyArr.push({
  from: path.resolve(__dirname, '../src/public'),
  to: './',
  ignore: ['.*'],
});

module.exports = {
  entry: entryObj,
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: isDev ? 'js/[name].js' : 'js/[name].[chunkhash:6].js',
    publicPath: isDev ? '/' : path.join(`/${projectConfig.remotePath}/`),
  },
  module: {
    rules: [
      {
        test: /\.m?(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: path.join(__dirname, './myloaders/px2rem-loader'),
            options: {
              remUnit: 100,
              remFixed: 4,
            },
          },
        ],
      },
      {
        test: /\.tsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
            },
          },
          {
            loader: path.join(__dirname, './myloaders/px2rem-loader'),
            options: {
              remUnit: 100,
              remFixed: 4,
            },
          },
        ],
      },
      {
        test: /\.ts?$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/,
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
        },
      },
      {
        test: /\.(png|jpg|gif|svg|svga)$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            // 需要下载file-loader和url-loader
            loader: 'url-loader',
            options: {
              limit: 5 * 1024, //小于这个时将会已base64位图片打包处理
              // 图片文件输出的文件夹
              outputPath: 'images',
            },
          },
        ],
      },
      {
        test: require.resolve('jquery'),
        use: [
          {
            loader: 'expose-loader',
            options: 'jQuery',
          },
          {
            loader: 'expose-loader',
            options: '$',
          },
        ],
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'url-loader',
        options: {
          limit: 10000,
        },
      },
      {
        test: /\.(njk|nunjucks|tpl|tmpl|html)$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          // nunjucks 模板
          {
            loader: 'nunjucks-isomorphic-loader',
            query: {
              root: [path.resolve(__dirname, '../src/project')],
            },
          },
          // html中的img标签
          'html-withimg-loader',
        ],
      },
    ],
  },
  // postcss: [px2rem({})],
  resolve: {
    alias: {
      '~src': path.resolve(__dirname, '../src'),
      '~node_modules': path.resolve(__dirname, '../node_modules'),
      '~config': path.resolve(__dirname, '../config'),
    },
    // 能够在引入模块时不带扩展
    extensions: ['.js', '.json', '.ts', '.tsx'],
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
          test: /[\\/]node_modules[\\/](react|react-dom|fastclick|(\@babel)|core-js)[\\/]/, // 指定是node_modules下的第三方包
          chunks: 'initial',
          name: 'vendor', // 打包后的文件名，任意命名
          // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
          priority: 10,
        },
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
    new webpack.DefinePlugin({
      'process.env': {
        SERVERIP: `"${getIP()}"`,
        STAGING: `${process.env.STAGING}`,
      },
    }),
    // 打包进度条
    new WebpackBar(),
    //静态资源输出
    new CopyWebpackPlugin(copyArr),
    ...htmlArr,
  ],
};
