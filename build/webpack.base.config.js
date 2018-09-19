'use strict'
/*
   webapck 基础配置
*/
const HtmlWebpackPlugin = require('html-webpack-plugin') // 根据模板生成 HTML
const packageConfig = require('../package.json')
const config = require('../config/index')
const utils = require('./utils')
const common = config.common
const current = utils.currentEndAndConf(config)
const namedAssets = utils.resolve(current.conf.assetsSubDirectory)

module.exports = {
  context: common.context,
  entry: utils.computeEntry(config, packageConfig), //  根据环境返回对应的入口配置
  output: utils.computeOutput(config), // 根据环境返回对应的出口配置
  cache: true,
  resolve: {
    extensions: ['.js', '.json', '.jsx', '.css'], //  默认的扩展名 使用的引用相关文件的时候 可以不带相应的扩展名
    modules: ['node_modules', common.sourceCode] // 解析模块时  应该搜索的目录
  },
  module: { //  https://www.webpackjs.com/concepts/loaders/   配置模块处理
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'eslint-loader',
        enforce: 'pre', //  预先进行eslint的语法减产
        include: common.sourceCode,
        options: {
          formatter: require('eslint-friendly-formatter') // https://www.npmjs.com/package/eslint-friendly-formatter
        }
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        include: common.sourceCode
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: namedAssets(current.env !== 'production' ? 'imgs/[name].[ext]' : 'imgs/[name].[hash:10].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: namedAssets(current.env !== 'production' ? 'media/[name].[ext]' : 'media/[name].[hash:10].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: namedAssets(current.env !== 'production' ? 'fonts/[name].[ext]' : 'fonts/[name].[hash:10].[ext]')
        }
      },
      // {
      //   test: require.resolve(common.requestModule),
      //   loader: 'imports-loader?basicRequestLink=>' + JSON.stringify(current.conf.basicRequestLink)
      // },
      {
        test: require.resolve(utils.resolve(common.sourceCode)('index.js')),
        loader: 'imports-loader?assetsPublicPath=>' + JSON.stringify(current.conf.assetsPublicPath)
      }
    ]
  },
  plugins: [
    /*
      https://www.npmjs.com/package/html-webpack-plugin
      https://segmentfault.com/a/1190000013883242
      配置项详解
      template: 指定你生成的文件所依赖哪一个html文件模板
      filename: html的文件名 默认是index.html
      inject: 'body' script标签 位于html文件的body底部
      minify: 对生成的HTML文件进行压缩
      xhtml:  设置为true
      cache: 默认为true  标示内容变化的时候 生成一个新的文件
    */
    new HtmlWebpackPlugin({
      template: utils.resolve(common.sourceCode)('index.html'),
      filename: 'index.html',
      inject: 'body',
      minify: false,
      xhtml: true,
      cache: false
      // favicon: ''
    })
  ]
}
