var path = require('path');

var CopyWebpackPlugin = require('copy-webpack-plugin');
var ArchivePlugin = require('webpack-archive-plugin');

var config = require('./config');

if (config.ambiente === 'PRODUCAO') {
	module.exports = {
		entry: './app/index.js',
		output: {
			path: __dirname + '/dist',
			filename: 'app.bundle.js'
		},

		resolve: {
			root: path.resolve(__dirname),
			alias: {
				lib: 'lib/js',
				config: 'config'
			}
		},


		plugins: [
			new CopyWebpackPlugin([
				{from: __dirname + '/lib', to:'lib'}
			]),

			new ArchivePlugin()
		]
	};
}

else if (config.ambiente === 'DESENVOLVIMENTO') {
	module.exports = {
		entry: './app/index.js',
		output: {
			path: __dirname + '/dist',
			filename: 'app.bundle.js'
		},

		module: {
			loaders: [{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			}]
		},

		resolve: {
			root: path.resolve(__dirname),
			alias: {
				lib: 'lib/js',
				config: 'config'
			}
		},

		target: "electron",

		plugins: [
			new CopyWebpackPlugin([
				{from: __dirname + '/app/assets', to:'assets'}
			])
		]
	};
}
