const path = require('path')
const nodeExternals = require('webpack-node-externals');
const CompressionPlugin = require("compression-webpack-plugin");



const config = {
	mode: 'production',
	resolve: {
		extensions: ['.ts', '.js']
	},
	module:{
		rules: [
			{
				test: /\.tsx?/,
				use: 'ts-loader',
				exclude: /node_modules/
			}
		]
	}
}

const app = Object.assign({}, config, {
	name: 'p2p-game-net-app',
	entry: './src/app/main.ts',
	plugins: [new CompressionPlugin()],
	output: {
		path: path.resolve( __dirname, 'static/js' ),
		filename: 'network.js'
	}
})

const demo = Object.assign({}, config,{
	name: 'p2p-game-net-demo',
	entry: './src/demo/main.ts',
	output: {
		path: path.resolve( __dirname, 'static/js'),
		filename: 'demo.js'
	},
})

module.exports = [app, demo]
