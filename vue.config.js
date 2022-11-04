const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  // 是否要转译node_modules中的所有依赖将被Babel转译
  transpileDependencies: true,
  // 打包输出路径
  outputDir: 'dist',
  // 基本路径
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  // 静态资源目录
  assetsDir: 'static',
  // html输出路径
  indexPath: 'index.html',
  // 文件名哈希
  filenameHashing: true,
  // 是否在构建生产包时生成 sourceMap 文件，false将提高构建速度
  productionSourceMap: false,
  // eslint-loader 是否在保存的时候检查
  lintOnSave: true,
  // webpack-dev-server 相关配置
  devServer: {
    open: false,
    host: 'localhost',
    port: 6060,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
})
