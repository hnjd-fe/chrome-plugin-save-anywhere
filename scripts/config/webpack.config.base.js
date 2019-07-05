const helpers = require('./helpers')
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const config = require('./config');

const path = require( 'path' );
const os = require('os')
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length});
const webpack = require('webpack');

const cssLoader = bool => {
    const defaultVal = [
        {
            loader: 'css-loader',
            options: {
                minimize: true,
                sourceMap: false
            }
        },
        {
            loader: 'less-loader',
            options: {
                sourceMap: true
            }
        }
    ];
    const postcssLoader = {
        loader: 'postcss-loader'
    };
    if (bool) {
        defaultVal.splice(1, 0, postcssLoader);
    }
    return defaultVal;
};

function createHappyPlugin(id, loaders) {
    return new HappyPack({
        id: id,
        loaders: loaders,
        threadPool: happyThreadPool,
        verbose: false,
    });
}

let webpackConfig = {
    entry: config.common.entries,
    output: {
        path: helpers.root('/save-anywhere/'),
        filename: 'js/[name]_[hash].js',
        chunkFilename: 'js/[name]_[hash].js',
        publicPath: './'
    },
    //devtool: 'source-map',
    resolve: {
        extensions: [ '.js', '.ts', '.tsx', '.vue', '.less', '.css', '.html', '.bak' ],
        alias: {
            '@root': helpers.root('/'),
            '@src': helpers.root('/src'),
            'Utils': helpers.root( '/src/utils' ),
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: [ helpers.root('node_modules'),helpers.root('vendor'), './vendor', 'vendor' ],
                loader: 'awesome-typescript-loader'
            },
            {
                test: /\.js$/,
                //use: 'happypack/loader?id=js',
                loader: 'babel-loader',
                //include: []
            },

            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.html$/,
                loader: 'raw-loader'
            },
            {
                test: /\.tpl$/,
                loader: 'html-loader'
            },
            {
                test: /\.ejs$/,
                loader: 'ejs-loader'
            },
            {
                test: /\.bak$/,
                loader: 'raw-loader'
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'happypack/loader?id=less'
                })
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'happypack/loader?id=css'
                })
            },
            {
                test: /\.(eot|ttf|woff|woff2)(\?\S*)?$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: 'fonts/[name].[ext]',
                        publicPath:
                            process.env.NODE_ENV == 'development'
                            ? config.dev.assetsPublicPath
                            : config.build.assetsPublicPath

                    }
                }
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?\S*)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 8192,
                        name: `images/[name].[ext]?branch=${config.branch}&ver=${
                            config.f2e_version
                        }`,
                        publicPath:
                            process.env.NODE_ENV == 'development'
                            ? config.dev.assetsPublicPath
                            : config.build.assetsPublicPath
                    }
                }
            }
        ]
    },
    externals: {
        echarts: 'echarts',
        chrome: 'chrome',
        ydn: 'ydn',
        THREE: 'THREE'
    },
    plugins: [
        new webpack.IgnorePlugin(/\.\/locale$/),
        new NamedModulesPlugin(),
        new VueLoaderPlugin(),
        new CopyWebpackPlugin([{
            from: 'src/assets',
            to: './assets'
        } ]),
        new ExtractTextPlugin({
            disable: process.env.NODE_ENV == 'development',
            filename:
                "css/[name].css",
            allChunks: true
        }),
        createHappyPlugin('js', ['babel-loader']),
        createHappyPlugin('less', cssLoader()),
        createHappyPlugin('css', ['css-loader']),
        new ProgressBarPlugin()
    ]
}

module.exports = webpackConfig
