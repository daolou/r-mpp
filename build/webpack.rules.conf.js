// const extractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const isDev = process.env.NODE_ENV == 'development';
const rules = [
  {
    test: /\.m?js$/,
    exclude: /(node_modules|bower_components)/,
    use: [
      {
        loader: 'babel-loader',
      },
      {
        loader: path.join(__dirname, './myloaders/px2rem-loader'),
        options: {
          remUnit: 100,
          remFixed: 2,
        },
      },
    ],
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
    test: /\.(njk|nunjucks|tpl|tmpl|html)$/,
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
  {
    test: /\.(le|c)ss$/,
    use: [
      {
        loader: MiniCssExtractPlugin.loader,
        options: {
          hmr: isDev,
        },
      },
      {
        loader: 'css-loader',
        options: {
          importLoaders: 2,
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
];
module.exports = rules;
