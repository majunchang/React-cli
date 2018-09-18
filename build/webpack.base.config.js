const HtmlWebpackPlugin = require('html-webpack-plugin')
const packageConfig = require('../package.json')
const config = require('../config/index')
const utils = require('./utils')
const common = config.common
const currentEndAndConf = utils.currentEndAndConf(config)
const namedAssets = utils.resolve(currentEndAndConf.conf.assetsSubDirectory)

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
      {
        test: /\.(js|jsx)$/,
        loader: 'eslint-loader',
        enforce: 'pre', // 预先进行 eslint 语法检查
        include: common.sourceCode,
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      }, {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        include: common.sourceCode
      }, {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: namedAssets(
            currentEndAndConf.env !== 'production'
              ? 'imgs/[name].[ext]'
              : 'imgs/[name].[hash:10].[ext]')
        }
      }, {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: namedAssets(
            currentEndAndConf.env !== 'production'
              ? 'media/[name].[ext]'
              : 'media/[name].[hash:10].[ext]')
        }
      }, {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: namedAssets(
            currentEndAndConf.env !== 'production'
              ? 'fonts/[name].[ext]'
              : 'fonts/[name].[hash:10].[ext]')
        }
      }
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
