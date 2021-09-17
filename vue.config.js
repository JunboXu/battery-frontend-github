module.exports = {
  lintOnSave: false,
  runtimeCompiler: true,
  devServer: {
    host:'0.0.0.0',
    port: 8080,
    open: true,
    hot:true,
    disableHostCheck: true,
    overlay: {
      warnings: false,
      errors: true
    },
    // before: require('./mock/mock-server.js')
    proxy: {
      // change xxx-api/login => mock/login
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      '/api':{
        
        changeOrigin: true, // //开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样客户端端和服务端进行数据的交互就不会有跨域问题
        pathRewrite: { //// 思路是如果是开发环境，就给所有要代理的接口统一加上前缀，然后代理请求时再统一通过rewrite去掉
            '^api': ''
        },
        target: 'http://127.0.0.1:8000/',
      }
    },
  },
  configureWebpack: {
    //Necessary to run npm link https://webpack.js.org/configuration/resolve/#resolve-symlinks
    resolve: {
       symlinks: false
    }
  },
  transpileDependencies: [
    '@coreui/utils',
    '@coreui/vue'
  ]
}
