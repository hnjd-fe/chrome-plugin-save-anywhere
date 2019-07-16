
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const helpers = require('./helpers')
const webpackConfig = require('./webpack.config.base')
const env = require('../environment/dev.env')

let prod = require( '../../prod.config' );
let config = require( './config' );

prod.host = prod.host || 'localhost';

let url = [ 'http://', prod.host ];
prod.port && url.push( ':', prod.port );
url.push( '/' );

webpackConfig.module.rules = [
    ...webpackConfig.module.rules,
]

webpackConfig.output =  {
    filename: 'static/js/[name]_[hash].js'
    //, publicPath:  url.join('')
    , publicPath:  '/'
},

( prod.host && prod.port ) && ( webpackConfig.output.publicPath = url.join('') );

webpackConfig.plugins = [...webpackConfig.plugins,

    new webpack.DefinePlugin({
        'process.env': env
    }),

    new HtmlWebpackPlugin({
        inject: true,
        filename: "index.html",
        title: config.package.name,
        chunks: ['manifest', 'vendor', 'index'],
        template: `${helpers.root('/src/index.ejs')}`,
        showErrors: true,
        favicon: helpers.root('/src/favicon.ico')
    }),

    new HtmlWebpackPlugin({
        inject: true,
        filename: "login.html",
        title: config.package.name,
        chunks: ['manifest', 'vendor', 'login'],
        template: `${helpers.root('/src/index.ejs')}`,
        favicon: helpers.root('/src/favicon.ico')
    }),

    new HtmlWebpackPlugin({
        inject: true,
        filename: "popup.html",
        title: config.package.name,
        chunks: ['manifest', 'vendor', 'popup'],
        template: `${helpers.root('/src/popup.ejs')}`,
        favicon: helpers.root('/src/favicon.ico')
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

    new ExtractTextPlugin({
        disable: process.env.NODE_ENV == 'development',
        filename:
            "src/css/[name].css?branch={{$branches['branch']}}&ver={{$branches['f2e_version']}}",
        allChunks: true
    })
]

let devConfig = {
    open: false,
    hot: true,
    historyApiFallback: true,

    proxy: [
        {
            path: /\/(importExport|dataManage).html/,
            bypass: function(req, res, proxyOptions) {
                if (req.headers.accept.indexOf('html') !== -1) {
                    return '/index.html';
                }
            }
        }
    ],

    contentBase: config.dev.assetsProdRoot,
    publicPath: '/',
    headers: {
        "Access-Control-Allow-Origin": "*"
    },
    watchOptions: {
        poll: config.dev.poll
        , ignored: [/node_modules/, /__test__/, /\.bak$/ ]
    },
    before: function(app) {
        //console.log( app );
        app.get('*.css', function(req, res) {
            res.sendStatus(200);
        });
        /*
        app.get('chrome_login.js', function(req, res) {
            res.sendStatus(200);
        });
        */

    }
};

prod.port && ( devConfig.port = prod.port );
prod.port && prod.host && ( devConfig.host = prod.host );

webpackConfig.devServer = devConfig;

module.exports = webpackConfig
