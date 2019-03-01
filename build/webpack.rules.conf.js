// const extractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const path = require('path');
const isDev = process.env.NODE_ENV == 'development';
const rules = [
  {
    test: /\.m?js$/,
    exclude: /(node_modules|bower_components)/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env'],
      },
    },
  },
  {
    test: /\.(png|jpg|gif)$/,
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
    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
    loader: 'url-loader',
    options: {
      limit: 10000,
    },
  },
  {
    test: /\.html$/,
    // html中的img标签
    use: ['html-withimg-loader'],
  },
  {
    test: /\.(le|c)ss$/,
    use: [
      isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          importLoaders: 2,
        },
      },
      {
        loader: 'postcss-loader',
        options: {
          plugins: [
            require('autoprefixer')({
              browsers: ['last 10 versions'],
            }),
          ],
        },
      },
      'less-loader',
    ],
  },
];
module.exports = rules;
