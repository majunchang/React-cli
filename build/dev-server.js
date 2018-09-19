'use strict'
/*
   开发环境启动
*/
const config = require('../config/index')
const devConfig = config.development

// 设置环境变量
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(devConfig.env.NODE_ENV)
}

const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const opn = require('opn') //  一个node插件  在浏览器中打开指定链接  https://www.npmjs.com/package/opn
const chalk = require('chalk') // 命令行输出美化插件
const webpackConfig = require('./webpack.dev.config')
const utils = require('./utils')

const common = config.common
const resolve = utils.resolve(common.context)

//  devServerOptions的配置选项  https://www.webpackjs.com/configuration/dev-server/
const devServerOptions = {
  contentBase: resolve('dev'), //  告诉服务器从哪里提供内容
  publicPath: devConfig.assetsPublicPath, // 此路径下的打包文件可在浏览器中访问
  historyApiFallback: true, // 任意的 404 响应都可能需要被替代为 index.html
  //    clientLogLevel: 'none',
  hot: true, // 启用 webpack的模块热替换特性
  inline: true, // 在 dev-server 的两种不同模式之间切换
  compress: true, // 一切服务使用gzip压缩
  openPage: 'index.html', //  Specify a page to navigate to when opening the browser.
  stats: { // https://www.webpackjs.com/configuration/stats/
    colors: true,
    errors: true,
    warnings: true,
    modules: false,
    chunks: false
  }
}

const compiler = webpack(webpackConfig)
const server = new WebpackDevServer(compiler, devServerOptions)
const { port, devServerIp, basicRequestLink } = devConfig

server.listen(port, devServerIp, () => {
  const link = `http://${devServerIp}:${port}`
  console.log(chalk.cyan(`Starting server on ${link}`))
  console.log(chalk.cyan(`development data server on ${basicRequestLink}`))
  console.log(chalk.yellow('webpack正在运营一个项目'))

  opn(link)
    .then(() => {
      console.log(chalk.cyan('success open ...'))
    })
    .catch(err => {
      console.log(chalk.red(err))
    })
})
