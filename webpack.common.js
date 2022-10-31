const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    app: "./src/app.js"
  },
  output: {
    filename: "[name].[fullhash].js",
    path: resolve(__dirname, "dist/"),
    assetModuleFilename: "assets/icons/[hash].[ext]"
  },
  plugins: [new HtmlWebpackPlugin({
    template: "./public/template.html"
  })],
  module: {
    rules: [
      {
        test: /\.(png|jpg|svg|gif|jpeg)$/,
        type: "asset/resource"
      }
    ]
  }
}