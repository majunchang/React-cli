'use strict'
/*
   development 环境下 webpack 配置文件，安装 plugins
*/
const webpack = require('webpack')
const merge = require('webpack-merge') //  用来合并webpack配置  解释merge的好处  https://www.cnblogs.com/zhengrunlin/p/7575118.html   https://www.npmjs.com/package/webpack-merge

const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin') //  优化错误i、提示插件
const CleanWebpackPlugin = require('clean-webpack-plugin') // 构建前 清空目录插件
const baseWebpackConfig = require('./webpack.base.config')
const utils = require('./utils')
const config = require('../config/index')
const common = config.common
const current = utils.currentEndAndConf(config)
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = merge(baseWebpackConfig, {
  devtool: '#cheap-module-eval-source-map', //  https://www.webpackjs.com/configuration/devtool/
  module: {
    rules: [
      {
        test: /\.(scss|sass|css)$/, //  样式文件的处理 以及 loader的加载
        include: common.sourceCode,
        use: utils.computeStyleLoader(false, ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'])
      }
    ]
  },
  // webpack plugins的对应列表
  // https://www.webpackjs.com/plugins/
  plugins: [
    new CleanWebpackPlugin(['dev'], { root: common.context }),
    // 使用模块的路径，而不是数字标识符作为ID，避免解析顺序引起的 hash 变化
    new webpack.NamedModulesPlugin(),
    // 热模块替换插件   运行机制 https://www.cnblogs.com/wmhuang/p/7137480.html
    new webpack.HotModuleReplacementPlugin(),
    // 定义process.env.NODE_ENV环境变量
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': current.conf.env.NODE_ENV }),
    // 将引入的第三方库拆分出来 https://www.webpackjs.com/plugins/commons-chunk-plugin/
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor' }),
    // 将运行时代码拆分出来，配合其他插件避免每次打包 hash 都变化
    new webpack.optimize.CommonsChunkPlugin({ name: 'runtime' }),
    // 编译出现错误时,跳过输出阶段,确保输出资源不会包含错误  https://www.webpackjs.com/plugins/no-emit-on-errors-plugin/
    new webpack.NoEmitOnErrorsPlugin(),
    new FriendlyErrorsPlugin(),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.development.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})
