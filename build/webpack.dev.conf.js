'use strict'
process.env.NODE_ENV = 'development'

const path = require('path')
const utils = require('./utils')
const config = require('../config')
const merge = require('webpack-merge')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const baseWebpackConfig = require('./webpack.base.conf')

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  devServer: {
    clientLogLevel: 'warning',
    hot: false,
    contentBase: path.resolve(__dirname, '../src'), // since we use CopyWebpackPlugin.
    compress: false,
    host: 'localhost',
    port: 8000,
    open: false,
    openPage: '',
    publicPath: '/',
    headers: {
        "Access-Control-Allow-Origin": "*"
    },
    proxy: [
        {
            path: /\/(importExport|dataManage|settings).html/,
            bypass: function(req, res, proxyOptions) {
                if ( req.headers.accept && req.headers.accept.indexOf('html') !== -1) {
                    return '/index.html';
                }
            }
        }
    ],
    before: function(app) {
        //console.log( app );
        app.get('*.css', function(req, res) {
            res.sendStatus(200);
        });
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // copy custom static assets
    new CopyWebpackPlugin([{
      from: utils.resolve('static'),
      to: config.dev.assetsSubDirectory,
      ignore: ['.*']
    }])
  ]
})

module.exports = devWebpackConfig
