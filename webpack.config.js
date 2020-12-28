const path = require('path')
const nodeExternals = require('webpack-node-externals');


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
	output: {
		path: path.resolve( __dirname, 'static/js' ),
		filename: 'main.js'
	}
})

const server = Object.assign({}, config, {
	name: 'p2p-game-net-server',
	entry: './src/server/main.ts',
	output: {
		path: path.resolve( __dirname, 'server' ),
		filename: 'main.js'
	},
	externals: [nodeExternals()],

})

module.exports = [app]
