'use strict'
/* eslint-disable */

/*
   production 环境下 webpack 配置文件，安装 plugins
*/
const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin'); //  分离出样式文件的插件 抽离css样式,防止将样式打包在js中引起页面样式加载错乱的现象
const CleanWebpackPlugin = require('clean-webpack-plugin');    //  A webpack plugin to remove/clean your build folder(s) before building
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin'); //  优化css的插件
//  https://blog.csdn.net/wbiokr/article/details/73011288  在webpack中拷贝文件和文件夹的插件
const CopyWebpackPlugin = require('copy-webpack-plugin'); 
const baseWebpackConfig = require('./webpack.base.config');
const utils = require('./utils');
const config = require('../config/index');
const common = config.common;
const current = utils.currentEndAndConf(config);

// 打包信息展示插件
let reportPlugin = [];

if (current.conf.bundleAnalyzerReport) {
   const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

   reportPlugin.push(new BundleAnalyzerPlugin());
}

// workbox 插件
let workboxPlugin = [];

// webpack中使用workBox 实现PWA   https://blog.csdn.net/mjzhang1993/article/details/79584854
// if (current.conf.needWorkboxSW) {
//    const WorkboxPlugin = require('workbox-webpack-plugin');
//    const defaultConfig = {
//       cacheId: 'webpack-pwa',
//       skipWaiting: true,
//       clientsClaim: true,
//       swDest: 'service-wroker.js',
//       globPatterns: ['**/*.{html,js,css,png.jpg}'],
//       globIgnores: [ 'service-wroker.js' ],
//       runtimeCaching: [
//          {
//             urlPattern: /.*\.js/,
//             handler: 'networkFirst', // 网络优先
//          }
//       ]
//    };
//    workboxPlugin.push(new WorkboxPlugin.GenerateSW(current.conf.workboxConfig || defaultConfig));
// }

module.exports = merge(baseWebpackConfig, {
   devtool: current.conf.productionSourceMap ? '#source-map' : false,
   module: {
     /*
      https://www.npmjs.com/package/extract-text-webpack-plugin
      ExtractTextPlugin 该插件的三个参数的意义
      use: 使用什么样的loader 去编译文件
      fallback:   编译后使用什么loader 去提取css文件
      publicfile: 用来覆盖项目路径 生成该css文件的文件路径
     */
      rules: [
         {
            test: /\.(scss|sass|css)$/,
            include: common.sourceCode,
            use: ExtractTextPlugin.extract({
               fallback: 'style-loader',
               use: utils.computeStyleLoader(true, ['css-loader', 'postcss-loader', 'sass-loader'])
            })
         }
      ]
   },
   plugins: [
      new CleanWebpackPlugin(['dist'], { root: common.context }),
       // 根据模块的相对路径生成一个四位数的hash作为模块id, 避免解析顺序引起的 hash 变化   //  https://www.webpackjs.com/plugins/hashed-module-ids-plugin/
      new webpack.HashedModuleIdsPlugin(),
       // 作用域提升插件    https://cloud.tencent.com/developer/section/1477569
      new webpack.optimize.ModuleConcatenationPlugin(),
      // 设置生产环境变量
      new webpack.DefinePlugin({ 'process.env.NODE_ENV': current.conf.env.NODE_ENV }),
      // 配合输出 css
      new ExtractTextPlugin({
         filename: utils.resolve(current.conf.assetsSubDirectory)('css/[name].[contenthash:10].css'),
         disable: false,
         allChunks: true
      }),
       // 优化合并输出的css
       // https://www.npmjs.com/package/optimize-css-assets-webpack-plugin
       // 
      new OptimizeCSSPlugin({ cssProcessorOptions: { safe: true } }),
      // 压缩 js
      new webpack.optimize.UglifyJsPlugin({
         compress: {
            warnings: false,
            drop_debugger: true,
            drop_console: true
         },
         comments: false,
         space_colon: false
      }),
       // 拆分模块
      new webpack.optimize.CommonsChunkPlugin({ name: 'vendor' }),
      new webpack.optimize.CommonsChunkPlugin({ name: 'runtime' }),
      // new CopyWebpackPlugin([
      //    {
      //       from: 'src/manifest.json',
      //       to: 'manifest.json'
      //    },
      //    {
      //       from: 'src/icon.png',
      //       to: 'static/imgs/icon.png'
      //    }
      // ]),
      ...workboxPlugin,
      ...reportPlugin
   ]
});
