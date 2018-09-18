const webpack = require('webpack')
const merge = require('webpack-merge')
const ExtractTextPlugin = require('extract-text-webpack-plugin') //  分理出样式文件插件
const CleanWebpaclPlugin = require('clean-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin') // 优化 css 插件
const baseWebpackConfig = require('./webpack.base.config')
const utils = require('./utils')
const config = require('../config/index')
const common = config.common
const current = utils.currentEndAndConf(config)

let reportPlugin = []

if (current.conf.bundleAnalyzerReport) {
  // 如果可以显示 report 则添加如下插件
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

  reportPlugin.push(new BundleAnalyzerPlugin())
}

module.exports = merge(baseWebpackConfig, {
  devtool: current.conf.productionSourceMap ? '#source-map' : false,
  module: {
    rules: [
      {
        test: /\.(scss|sass|css)$/, // 样式文件 loader 配置，并分离输出
        include: common.sourceCode,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: utils.computeStyleLoader(true, ['css-loader', 'postcss-loader', 'sass-loader'])
        })
      }
    ]
  },
  plugin: [
    new CleanWebpaclPlugin(['dist'],{root:common.context}),
    // 根据模块的相对路径生成一个四位数的hash作为模块id，避免解析顺序引起的hash变化
    new webpack.HashedModuleIdsPlugin(),
    // 作用域提升插件
    new webpack.optimize.ModuleConcatenationPlugin(),
    // 设置生产环境变量
    new webpack.DefinePlugin({'process.env.NODE_ENV': current.conf.env.NODE_ENV}),
     // 配合输出 css
     new ExtractTextPlugin({
      filename: utils.resolve(current.conf.assetsSubDirectory)('css/[name].[contenthash:10].css'),
      disable: false,
      allChunks: true
    }),
    // 优化合并输出的css
    new OptimizeCSSPlugin({cssProcessorOptions:{safe:true}})
    // 压缩js
    new webpack.optimize.UglifyJsPlugin({
      compress:{
        warnings: false,
        'drop_debugger': true,
        'drop_console': true
      },
      comments: false,
      'space_colon': false
    })
    // 拆分模块
    new webpack.optimize.CommonsChunkPlugin({name: 'vendor'}),
    new webpack.optimize.CommonsChunkPlugin({name: 'runtime'}),
    ...reportPlugin
  ]
})
