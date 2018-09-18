const path = require('path')

exports.resolve = function (...basicPath) {
  return function (dir) {
    return path.join(...basicPath, dir || '')
  }
}

/*
通过 npm run build --report 执行
会产生 process.env.npm_config_report ,
通过 yarn run build --report 则可以在 process.argv 中拿到配置
*/
exports.shouldReport = function () {
  if (process.env.npm_config_report) {
    return process.env.npm_config_report
  }

  return process.argv.some((item) => item === '--report')
}

exports.currentEndAndConf = function (config) {
  const env = process.env.NODE_ENV
  const conf = config[env]
  console.log(env)
  console.log(conf)
  return {
    env,
    conf
  }
}

exports.computeEntry = function (config, packageConfig) {
  // 先解析出 当前的环境和对应的配置
  const {env, conf} = exports.currentEndAndConf(config)
  let entry = {}

  if (env === 'production') {
    // 生产环境
    entry.app = conf.entryPath || './src/index.js'
  } else if (env === 'development') {
    // 开发环境
    const {port, devServerIp, entryPath} = conf
    entry.app = [
      `webpack-dev-server/client?http://${devServerIp}:${port}`,
      'webpack/hot/only-dev-server',
      entryPath || './src/index.js'
    ]
  }
  // 将项目模块与导入的模块分离，也就是 package.json 中的 dependencies 部分
  entry.vendor = Object.keys(packageConfig.dependencies)

  return entry
}

exports.computeOutput = function (config) {
  // 先解析出，当前的环境，和对应的配置
  const {env, conf} = exports.currentEndAndConf(config)
  const filename = path.join(
    conf.assetsSubDirectory,
    env !== 'production' ? 'js/[name].bundle.js' : 'js/[name].[chunkhash:10].bundle.js'
  )
  const chunkFilename = env !== 'production'
    ? '[id].js'
    : '[id].[chunkhash:10].js'

  const output = {
    path: conf.assetsRoot,
    publicPath: conf.assetsPublicPath,
    filename,
    chunkFilename
  }

  return output
}

exports.styleLoadersOptions = {
  dev: {
    'sass-loader': {
      outputStyle: 'expanded',
      sourceMapContents: true,
      sourceMap: true
    }
  },
  prod: {
    'sass-loader': {outputStyle: 'expanded'}
  }
}

exports.computeStyleLoader = function (isProduction, loaders) {
  const optionsMap = exports.styleLoadersOptions[isProduction ? 'prod' : 'dev']
  const defaultOptions = isProduction ? {} : {sourceMap: true}

  return loaders.map(loader => {
    const options = optionsMap[loader] || defaultOptions

    return {loader, options}
  })
}
