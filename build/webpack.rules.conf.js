const extractTextPlugin = require("extract-text-webpack-plugin");
const isDev = process.env.NODE_ENV == 'development';
const rules = [
	// {
	// 	test: /\.(css|scss|sass)$/,
	// 	// 不分离的写法
	// 	// use: ["style-loader", "css-loader",sass-loader"]
	// 	// 使用postcss不分离的写法
	// 	// use: ["style-loader", "css-loader", "sass-loader","postcss-loader"]
	// 	// 此处为分离css的写法
	// 	/*use: extractTextPlugin.extract({
	// 		fallback: "style-loader",
	// 		use: ["css-loader", "sass-loader"],
	// 		// css中的基础路径
	// 		publicPath: "../"
	// 	})*/
	// 	// 区别开发环境和生成环境
	// 	use: isDev ? ["style-loader", "css-loader", "sass-loader", "postcss-loader"] : extractTextPlugin.extract({
	// 		fallback: "style-loader",
	// 		use: ["css-loader", "sass-loader", "postcss-loader"],
	// 		// css中的基础路径
	// 		publicPath: "../"

	// 	})
	// },
	{
		test: /\.m?js$/,
		exclude: /(node_modules|bower_components)/,
		use: {
			loader: 'babel-loader',
			options: {
				presets: ['@babel/preset-env']
			}
		}
	}, 
	{
		test: /\.(png|jpg|gif)$/,
		use: [{
			// 需要下载file-loader和url-loader
			loader: "url-loader",
			options: {
				limit: 5 * 1024, //小于这个时将会已base64位图片打包处理
				// 图片文件输出的文件夹
				outputPath: "images"
			}
		}]
	},
	{
		test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
		loader: 'url-loader',
		options: {
			limit: 10000,
		}
	},
	{
		test: /\.html$/,
		// html中的img标签
		use: ["html-withimg-loader"]
	}, 
	{
		test: /\.css$/,
		include: /(src|node_modules)/,
		use: isDev ? [
			'style-loader',
			'css-loader',
			{
				loader: 'postcss-loader',
				options: {
					plugins: [require('autoprefixer')({
						browsers: ['last 10 versions']
					})]
				}
			}
		]:  extractTextPlugin.extract({
			fallback: 'style-loader',
			use: [
				'css-loader', 
				{
					loader: 'postcss-loader',
					options: {
						plugins: [require('autoprefixer')({
							browsers: ['last 10 versions']
						})]
					}
				}
			]
		})
	},
	{
		test: /\.less$/,
		// 三个loader的顺序不能变
		// 不分离的写法
		// use: ["style-loader", "css-loader", "less-loader"]
		// 区别开发环境和生成环境
		use: isDev ? ["style-loader", "css-loader",{
                    loader: 'postcss-loader',
                    options: {
                        plugins: [require('autoprefixer')({
                            browsers: ['last 10 versions']
                        })]
                    }
                }, "less-loader"] : extractTextPlugin.extract({
			fallback: "style-loader",
			use: ["css-loader",{
                    loader: 'postcss-loader',
                    options: {
                        plugins: [require('autoprefixer')({
                            browsers: ['last 10 versions']
                        })]
                    }
                }, "less-loader"],
			// css中的基础路径
			publicPath: "../"
		})
	}, 
	// {
	// 	test: require.resolve('zepto'),
	// 	loader: 'exports-loader?window.Zepto!script-loader'
	// }
];
module.exports = rules;