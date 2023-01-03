const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (app) => {
	app.use(
		"/download",
		createProxyMiddleware({
			target: process.env.REACT_APP_SONG_DOWNLOADER_API,
			changeOrigin: true,
			pathRewrite: {
				"^/download": "",
			},
			onProxyRes: function (proxyRes, _, __) {
				proxyRes.headers["Access-Control-Allow-Origin"] = "*";
			},
		})
	);
};
