let path = require("path");
let config = require("./src/config.js");

module.exports = {
	outputDir: path.resolve(__dirname, "../public/vue/"),
	devServer: {
		proxy: {
			'/api': {
				target: `http://${config.CHAT_URL}/api`,
				changeOrigin: true,
				pathRewrite: {
					'^/api': ''
				}
			},
			'/auth': {
				target: `http://${config.AUTH_URL}/auth`,
				changeOrigin: true,
				pathRewrite: {
					'^/auth': ''
				}
			},
			'/spell': {
				target: `http://${config.SPELL_URL}/spell`,
				changeOrigin: true,
				pathRewrite: {
					'^/spell': ''
				}
			}
		}
	}
};
