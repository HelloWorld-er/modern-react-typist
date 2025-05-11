const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development",
    entry: {
        example: path.join(__dirname, "example/src/index.js"),
    },
    output: {
        path: path.join(__dirname, "example/dist"),
        filename: "[name].js",
        clean: true,
    },
    devtool: "source-map",
    devServer: {
        static: {
            directory: path.join(__dirname, "example/dist"),
        },
        compress: true,
        port: 3000,
        hot: true,
        historyApiFallback: true,
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"]
                    },
                },
            },
        ],
    },
    plugins: [
        new HTMLWebpackPlugin({
            title: "Typist Example",
            template: path.join(__dirname, "example/src/template.html"),
            filename: "index.html",
        }),
    ],
    resolve: {
        extensions: [".js", ".jsx"],
        modules: [path.join(__dirname, "node_modules"), path.join(__dirname, "src")],
    }

}