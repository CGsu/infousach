const webpack = require("webpack");
const path = require("path");

let DIST_DIR = path.resolve(__dirname, "dist");
let SRC_DIR = path.resolve(__dirname, "client");

let config = {
	mode: "development",
	entry: path.join(SRC_DIR, "index.js"),
	output: {
		path: path.join(DIST_DIR, "app"),
		filename: "bundle.js",
		publicPath: "/app"
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				include: SRC_DIR,
				loader: "babel-loader",
				query: {
					presets: ["@babel/react", "@babel/env"]
				}
			}
		]
	},
	devServer: {
		disableHostCheck: true
	}
}

module.exports = config;