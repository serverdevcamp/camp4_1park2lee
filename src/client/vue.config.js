let path = require("path");
let config = require("./src/config.js");

module.exports = {
	outputDir: path.resolve(__dirname, "../public/vue/"),
	devServer: {
		proxy: {
			'/api': {
				target: config.CHAT_URL,
				changeOrigin: true,
				pathRewrite: {
					'^/api': ''
				}
			},
			'/auth': {
				target: config.AUTH_URL,
				changeOrigin: true,
				pathRewrite: {
					'^/auth': ''
				}
			},
			'/spell': {
				target: config.SPELL_URL,
				changeOrigin: true,
				pathRewrite: {
					'^/spell': ''
				}
			}
		}
	}
};
