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
      isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          importLoaders: 2, //如果sass文件里还引入了另外一个sass文件，另一个文件还会从postcss-loader向上解析。如果不加，就直接从css-loader开始解析。
          modules: true, //开启css的模块打包。css样式不会和其他模块发生耦合和冲突
        },
      },
      {
        loader: 'postcss-loader',
        options: {
          plugins: [
            require('autoprefixer')({
              browsers: ['last 10 versions'],
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
