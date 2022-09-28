const HtmlWebpackPlugin = require('html-webpack-plugin')
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin')

module.exports = (env, argv) => ({
	mode: argv.mode === 'production' ? 'production' : 'development',
	devtool: argv.mode === 'production' ? false : 'inline-source-map',

	entry: {
		code: './src/main/main.ts',
		ui: './src/ui/ui.tsx',
		worker: './src/worker/worker.ts',
	},

	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},

	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.(png|jpg|gif|woff2)$/i,
				type: 'asset/inline',
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
		],
	},

	plugins: [
		new HtmlWebpackPlugin({
			cache: false,
			inject: 'body',
			template: './src/ui/index.html',
			filename: 'ui.html',
			inlineSource: '.(js|css)$',
			chunks: ['ui', 'worker'],
			excludeChunks: ['worker'],
		}),
		new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/ui/]),
	],
})
