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

  return {
    env,
    conf
  }
}
