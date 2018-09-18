const ip = require('ip').address()
const utils = require('../build/utils')
const resolve = utils.resolve(__dirname, '../')

module.exports = {
  common: {
    context: resolve(''),
    sourceCode: resolve('src')
  },
  development: {
    env: {NODE_ENV: JSON.stringify('development')}, //  开发环境的环境变量
    port: process.env.PORT || 8080, // 开发的端口号
    devServerIp: ip,
    basicRequestLink: `http://${ip}:3167`,
    entryPath: null, //  入口文件路径 默认为 './src/index.jx'
    assetsRoot: resolve('dev'), //
    assetsSubDirectory: 'static', // 二级资源路径
    assetsPublicPath: '/' //  编译发布的根目录
  },
  production: {
    env: {NODE_ENV: JSON.stringify('production')},
    basicRequestLink: `http://${ip}:3167`,
    entryPath: null,
    assetsRoot: resolve('dist'), // 编译后的文件路径
    assetsSubDirectory: 'static', // 二级资源路径
    assetsPublicPath: '/', //  编译发布的根目录,
    productionSourceMap: false,
    bundleAnalyzerReport: utils.shouldReport()
  }
}
