var path = require("path");

module.exports = {
	outputDir: path.resolve(__dirname, "../public/"),
	devServer: {
		proxy: {
			'/api': {
				target: 'http://localhost:3000/api',
				changeOrigin: true,
				pathRewrite: {
					'^/api': ''
				}
			},
			'/auth': {
				target: 'http://localhost:3300/auth',
				changeOrigin: true,
				pathRewrite: {
					'^/auth': ''
				}
			},
			'/spell': {
				target: 'http://localhost:3200/spell',
				changeOrigin: true,
				pathRewrite: {
					'^/spell': ''
				}
			}
		}
	},
	resolve: {
		alias: {
			'~images': path.resolve(__dirname, '../public/images/')
		}
	}
};