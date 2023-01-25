const webpack = require("webpack");

module.exports = {
	webpack: {
		configure: {
			plugins: [
				new webpack.ProvidePlugin({
					Buffer: ["buffer", "Buffer"],
					process: "process/browser.js",
				}),
				new webpack.NormalModuleReplacementPlugin(/node:/, (resource) => {
					const mod = resource.request.replace(/^node:/, "");
					switch (mod) {
						case "buffer":
							resource.request = "buffer";
							break;
						case "stream":
							resource.request = "readable-stream";
							break;
						default:
							throw new Error(`Not found ${mod}`);
					}
				}),
			],
			resolve: {
				fallback: {
					buffer: require.resolve("buffer"),
					stream: require.resolve("stream-browserify"),
					"process/browser": require.resolve("process/browser"),
					process: require.resolve("process/browser"),
				},
			},
		},
		ignoreWarnings: [/Failed to parse source map/],
	},
};
