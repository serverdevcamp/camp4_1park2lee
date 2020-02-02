var path = require("path")

module.exports = {
	outputDir : path.resolve(__dirname, "../public/"),
	devServer: {
		proxy: {
			'/api': {
				target: 'http://localhost:3000/api',
				changeOrigin: true,
				pathRewrite: {
					'^/api': ''
				}
			}
		}
	},

}
