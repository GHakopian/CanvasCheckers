const HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

module.exports = {
	entry: './src/js/Startup.ts',
	output: {
		path: __dirname +"/dist",
		filename: "bundle.js",
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js']
	},
    devServer: {
        static: {
            directory: path.join(__dirname, '/dist'),
        },
        compress: true,
	},
	module: {
		rules: [
			{
				test: /\.ts?$/,
				exclude: /node_modules/,
				use: [
					{ loader: "ts-loader" }
				]
			},
			{
				test: /\.css$/,
				exclude: /node_modules/,
				use: [
					"style-loader",
					"css-loader"
				]
			},
			{
				test: /\.mp3$/,
				exclude: /node_modules/,
				use: [
					{ loader: 'file-loader' }
				]
			}
		]
	},
	plugins: [
    new HtmlWebpackPlugin({
			template: './src/index.html'
		})
  ],
}