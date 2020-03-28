const utils = require('./utils')
const config = require('../config')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const entryPlugins = utils.generateEntriesAndPlugins()
const { VueLoaderPlugin } = require('vue-loader');

const packageConfig = require('../package.json')

console.log( 'entries:', entryPlugins.entries );
console.log( 'process.env.NODE_ENV', process.env.NODE_ENV );

const assetsPublicPath = '../../'; 

module.exports = {
  entry: {
    ...entryPlugins.entries
  },
  output: {
    path: utils.resolve(__dirname, packageConfig.output ),
    filename: `${config.build.assetsSubDirectory}/js/[name].[hash:7].bundle.js`,
    publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath
  },
  resolve: {
    modules: [
      utils.resolve('node_modules'),
      utils.resolve('src')
    ],
    extensions: ['.js', '.json', 'scss', 'css', 'less', 'vue' ],
    alias: {
      '@': utils.resolve('src'),
      '@src': utils.resolve('src'),
      '@root': utils.resolve('./'),
      '~': utils.resolve('node_modules'),
	  'vue$': 'vue/dist/vue.esm.js'
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        include: [ utils.resolve('src') ]
      },
      {
        test: /\.js$/,
        include: [
          utils.resolve('src')
        ],
        exclude: [
          utils.resolve('node_modules')
        ],
        use: [{
          loader: 'babel-loader'
        }/*,
        {
          loader: 'eslint-loader'
        }*/
        ]
      },
      {
        test: /\.(scss|sass)$/,
        use: [
			process.env.NODE_ENV === 'development' 
			? 'style-loader' 
			: MiniCssExtractPlugin.loader
			, 'css-loader', 'sass-loader', 'postcss-loader'
		]
      },
      {
        test: /\.(css|less)$/,
        use: [
          {
            loader: 'style-loader', // creates style nodes from JS strings
          },
          {
            loader: 'css-loader', // translates CSS into CommonJS
          },
          {
            loader: 'less-loader', // compiles Less to CSS
          },
        ],
      },
      {
        test: /\.html$/,
        // html中的img标签
        use: {
          loader: 'html-loader',
          options: {
            root: utils.resolve('src/assets'),
            attrs: ['img:src', 'img:data-src', 'audio:src'],
            minimize: false,
            interpolate: true
          }
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        // include: [utils.resolve('src')],
        loader: 'url-loader',
        options: {
          publicPath: process.env.NODE_ENV === 'production' ? assetsPublicPath : config.dev.assetsPublicPath,
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        include: [utils.resolve('src')],
        loader: 'url-loader',
        options: {
          publicPath: process.env.NODE_ENV === 'production' ? assetsPublicPath : config.dev.assetsPublicPath,
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        include: [utils.resolve('src'), utils.resolve('node_modules')],
        loader: 'file-loader',
        options: {
          publicPath: process.env.NODE_ENV === 'production' ? assetsPublicPath : config.dev.assetsPublicPath,
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }

    ]
  },
  plugins: [
    ...entryPlugins.plugins,
    // 全局暴露统一入口
    new webpack.IgnorePlugin(/\.\/locale$/),
	new VueLoaderPlugin(),
    new webpack.ProvidePlugin({
      // $: 'jquery'
    })
  ]
}
