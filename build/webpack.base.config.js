const HtmlWebpackPlugin = require('html-webpack-plugin')
const packageConfig = require('../package.json')
const config = require('../config/index')
const utils = require('./utils')
const common = config.common
const currentEndAndConf = utils.getEnvAndConf(config)
const nameAssets = utils.resolve(currentEndAndConf.conf.assetsSubDirectory)

module.exports = {
  context: common.context,
  entry: utils.computeEntry(config, packageConfig), // 根据环境返回对应的入口配置
  output: utils.computeOutput(config),
  cache: true,
  resolve: {
    extensions: [ // 默认的扩展名 使用引用的时候 可以不带相应的扩展名
      '.js', '.json', '.jsx', '.css'
    ],
    modules: ['node_modules', common.sourceCode] // 告诉webpack  解析模块时  应该解析的目录
  },
  module: {
    rules: [

    ],
    plugins: [
      new HtmlWebpackPlugin({
        template: utils.resolve(common.sourceCode)('index.html'),
        filename: 'index.html',
        inject: 'body',
        minify: false,
        xhtml: true,
        cache: false
      })
    ]
  }
}
