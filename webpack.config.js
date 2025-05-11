const path = require("path");

module.exports = {
    mode: "production",
    entry: {
        Typist: path.join(__dirname, "src/typist.jsx"),
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].js",
        library:  "Typist",
        libraryTarget: "umd",
        globalObject: "typeof self !== 'undefined' ? self : this",
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"],
                    },
                },
            },
        ],
    },
    resolve: {
        extensions: [".js", ".jsx"],
        modules: [path.join(__dirname, "node_modules"), path.join(__dirname, "src")],
    },
    externals: {
        react: "react",
    }
}