
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const webpackConfig = require('./webpack.config.base')
const helpers = require('./helpers')
const env = require('../environment/prod.env')

let prod = require( '../../prod.config' );
let config = require( './config' );

webpackConfig.module.rules = [
    ...webpackConfig.module.rules,
]

// ensure ts lint fails the build
webpackConfig.module.rules[0].options = {
  failOnHint: true
}

webpackConfig.output.filename = 'js/[name].js';
webpackConfig.output.chunkFilename = 'js/[name].js';

webpackConfig.plugins = [
    ...webpackConfig.plugins,

    new webpack.DefinePlugin({
        'process.env': env
    }),

    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: function (module) {
            return module.context && module.context.indexOf('node_modules') !== -1
        }
    }),
    new webpack.optimize.CommonsChunkPlugin({
        name: 'manifest',
        minChunks: Infinity
    }),

    new HtmlWebpackPlugin({
        inject: true,
        filename: helpers.root('/dist/index.html'),
        title: config.package.name,
        chunks: ['manifest', 'vendor', 'index'],
        template: `${helpers.root('/src/index.ejs')}`,
        favicon: helpers.root('/src/favicon.ico'),
        minify: {
            removeComments: true,
            collapseWhitespace: false,
            removeRedundantAttributes: false,
            useShortDoctype: false,
            removeEmptyAttributes: false,
            removeStyleLinkTypeAttributes: false,
            keepClosingSlash: false,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: false
        }
    }),

    new HtmlWebpackPlugin({
        inject: true,
        filename: helpers.root('/dist/login.html'),
        title: config.package.name,
        chunks: ['manifest', 'vendor', 'login'],
        //template: helpers.root('/src/index.html'),
        template: `${helpers.root('/src/index.ejs')}`,
        favicon: helpers.root('/src/favicon.ico'),
        minify: {
            removeComments: true,
            collapseWhitespace: false,
            removeRedundantAttributes: false,
            useShortDoctype: false,
            removeEmptyAttributes: false,
            removeStyleLinkTypeAttributes: false,
            keepClosingSlash: false,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: false
        }
    }),

    new HtmlWebpackPlugin({
        inject: true,
        filename: helpers.root('/dist/popup.html'),
        title: config.package.name,
        chunks: ['manifest', 'vendor', 'popup'],
        //template: helpers.root('/src/index.html'),
        template: `${helpers.root('/src/popup.ejs')}`,
        favicon: helpers.root('/src/favicon.ico'),
        minify: {
            removeComments: true,
            collapseWhitespace: false,
            removeRedundantAttributes: false,
            useShortDoctype: false,
            removeEmptyAttributes: false,
            removeStyleLinkTypeAttributes: false,
            keepClosingSlash: false,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: false
        }
    }),

    new FaviconsWebpackPlugin(helpers.root('/src/icon.png'))
]

if (prod.isCompress) {
    webpackConfig.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            output: {
                comments: false
            }
        })
    );
}

module.exports = webpackConfig
