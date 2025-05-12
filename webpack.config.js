const path = require("path");
const webpack = require("webpack");

module.exports = {
    entry: {
        Typist: "./src/Typist.tsx",
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js",
        library: {
            name: "ModernReactTypist",
            type: "umd",
        },
        globalObject: "typeof self !== 'undefined' ? self : this",
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: "ts-loader",
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/preset-env",
                            "@babel/preset-react"
                        ],
                        plugins: [
                            "@babel/plugin-transform-runtime"
                        ]
                    }
                }
            }
        ]
    },
    plugins: [
        new webpack.BannerPlugin({
            banner: "\'use client\';",
            raw: true,
            entryOnly: true,
            stage: webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE,
        }),
    ],
    externals: {
        react: "React",
        "react-dom": "ReactDOM",
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    }
};
