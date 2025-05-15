const path = require("path");
const webpack = require("webpack");

module.exports = {
    entry: {
        Typist: path.join(__dirname, "./src/Typist.tsx"),
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].js",
        library: {
            name: "ModernReactTypist",
            type: "umd",
        },
        globalObject: "this",
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.tsx$/,
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
                            "@babel/plugin-transform-runtime",
                            "@babel/plugin-proposal-class-properties",
                            "@babel/plugin-proposal-object-rest-spread"
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
        react: "react",
        "react-dom": "react-dom"
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    }
};
