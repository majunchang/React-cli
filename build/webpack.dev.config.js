const webpack = require('webpack')
const merge = require('webpack-merge') //  合并webpack配置
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin') //  优化错误提示文件
const CLeanWebpackPlugin = require('clean-webpack-plugin') // 构建前清空目录插件
const baseWebpckConfig = require('./webpack.base.config')

const utils = require('./utils')
const config = require('../config/index')

const common = config.common
const currentEndAndConf = utils.currentEndAndConf(config)
console.log('majunchang')

module.exports = merge(baseWebpckConfig, {
  devtool: '##cheap-module-eval-source-map',
  module: {
    rules: [
      {
        test: /\.(scss|sass|css)$/, // 样式文件处理
        include: common.sourceCode,
        use: utils.computeStyleLoader(false, ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'])
      }
    ]
  },
  plugins: [
    new CLeanWebpackPlugin(['dev']), {root: common.context},
    // 使用模块的路径
    new webpack.NamedModulesPlugin(),
    // 热模块替换插件
    new webpack.HotModuleReplacementPlugin(),
    // 定义process.env.NODE_ENV的环境变量
    new webpack.DefinePlugin({'process.env.NODE_ENV': currentEndAndConf.conf.env.NODE_ENV}),
    // 将引入的第三方库拆分开来
    new webpack.optimize.CommonsChunkPlugin({name: 'vendor'}),
    // 将运行时代码拆分开来  配合其他插件避免每次打包hash都会发生变化
    new webpack.optimize.CommonsChunkPlugin({name: 'runtime'}),
    // 编译出现错误的时候，跳过输出阶段， 确保输出资源不会包含错误
    new webpack.NoEmitOnErrorsPlugin(),
    new FriendlyErrorsPlugin()
  ]
})
