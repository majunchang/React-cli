const config = require('../config/index')
const devConfig = config.development

// 设置环境变量
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(devConfig.env.NODE_ENV)
}

const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const opn = require('opn') //  一个node的插件  在浏览器中打开指定链接
const chalk = require('chalk') // 命令行输出美化插件
const webpackConfig = require('./webpack.dev.config')
console.log('刘亦菲')
const utils = require('./utils')

const common = config.common
const resolve = utils.resolve(common.context)

//  配置webpack-dev-server
const devServerOptions = {
  contentBase: resolve('dev'),
  publicPath: devConfig.assetsPublicPath,
  historyApiFallBack: true,
  clientLogLevel: 'none',
  hot: true,
  inline: true,
  compress: true,
  openPage: 'index.html',
  stats: {
    colors: true,
    errors: true,
    warnings: true,
    modules: false,
    chunks: false
  }
}
console.log('12345')
//  开启服务
const compiler = webpack(webpackConfig)
console.log(1)
const server = new WebpackDevServer(compiler, devServerOptions)
console.log('2')
const {port, devServerIp, basicRequestLink} = devConfig

server.listen(port, devServerIp, () => {
  const link = `http://${devServerIp}:${port}`
  console.log(chalk.cyan(`Starting server on ${link}`))
  console.log(chalk.cyan(`development data server on ${basicRequestLink}`))
  opn(link).then(() => {
    console.log(chalk.cyan('success open ...'))
  }).catch(err => {
    console.log(chalk.red(err))
  })
})
