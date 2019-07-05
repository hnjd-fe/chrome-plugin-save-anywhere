'use strict';

const path = require('path');
const prodConfig = require('../../prod.config');

const helpers = require('./helpers')
const packageData = require( '../../package.json' )

const paths = {
    resource: path.resolve(process.cwd(), 'src'),
    assets: path.resolve(process.cwd(), 'src/assets'),
    config: path.resolve(process.cwd(), 'config'),
    lang: path.resolve(process.cwd(), 'scripts/config/lang/')
};

paths.components = path.resolve(paths.assets, 'components');

const host = prodConfig.host || process.env.HOST;
const port = prodConfig.port || process.env.PORT;

module.exports = {
    package: packageData,
    common: {
        assets: paths.assets,
        resource: paths.resource,
        lang:paths.lang,
        entries: {
            'login'     : helpers.root('/src/pages/login/index.js')
            , 'popup'     : helpers.root('/src/pages/popup/index.js')
            , 'index'     : helpers.root('/src/pages/index/index.js')
        }
    },
    dev: {
        assetsProdRoot: path.resolve(process.cwd(), 'src'),
        assetsSubDirectory: 'src',
        //assetsPublicPath: `//${host}:${port}/`,
        proxyTable: [
            {
                context: ['/'],
                target: 'http://localhost:8080'
            }
        ],
        /*
        host, // can be overwritten by process.env.HOST
        port, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
        */
        autoOpenBrowser: false,
        errorOverlay: true,
        notifyOnErrors: true,
        poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-
        devtool: 'eval-source-map', // https://webpack.js.org/configuration/devtool/#development
        cssSourceMap: false
    },
    build: {
        assetsProdRoot: path.resolve(process.cwd(), prodConfig.targetDir || 'save-anywhere'),
        assetsSubDirectory: 'src',
        assetsPublicPath:
            prodConfig.host && prodConfig.port ? `//${prodConfig.host}:${prodConfig.port}/` : '/',

        productionSourceMap: false,
        // https://webpack.js.org/configuration/devtool/#production
        devtool: false,

        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],

        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        bundleAnalyzerReport: process.env.npm_config_report
    }
};
