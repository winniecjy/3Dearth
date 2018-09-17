var CleanWebpackPlugin = require('clean-webpack-plugin'),
	webpack = require('webpack'),
	ExtractTextWebpackPlugin = require('extract-text-webpack-plugin'),
	CopyWebpackPlugin = require('copy-webpack-plugin'),
	HtmlWebpackPlugin = require('html-webpack-plugin');

var minify = process.env.ENV == 'prod'; //是否压缩
// var minify = true;

module.exports = {
	entry : {
		index : './src/js/index.js'
	},
	output : {
		path : __dirname + '/dist',
		filename : 'js/[name].js'
	},
	module : {
		rules : [{
			test : /\.(css|scss)$/,
			use : ExtractTextWebpackPlugin.extract({
				use : [
					'css-loader?-url&-reduceTransforms',
					'sass-loader',
					'postcss-loader'
				]
			})
		}]
	},
	plugins : [
		new CleanWebpackPlugin('./dist'),
		new webpack.BannerPlugin('v0.17'),
		new ExtractTextWebpackPlugin('css/[name].css'),
		new webpack.ProvidePlugin({
			$: '../lib/zepto.js'
		}),
		new CopyWebpackPlugin([
			{
				from : './src/img',
				to : 'img',
				ignore : ['.gitkeep']
			}, {
				from : './src/audio',
				to : 'audio'
			}, {
				from : './src/lib',
				to : 'lib'
			}
		]),
		new HtmlWebpackPlugin({
			inject : false,
			minify : minify ? {
				collapseWhitespace : true,
				minifyCSS : true,
				minifyJS : true,
				removeComments : true
			} : false,
			template : './src/index.html'
		})
	],
	devServer: {
		contentBase: __dirname + '/dist',
		port: 7000,
		host: '0.0.0.0',
		// hot: true,
		inline: true
	}
};