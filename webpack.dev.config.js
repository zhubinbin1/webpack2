
let {merge} = require('webpack-merge')
let path = require('path')
let base = require('./webpack.base.config')
module.exports = merge(base,{
    mode:'development',
    devtool:'source-map',
    output:{
        // filename:'bundle.[hash:4].js',
        // filename:'bundle.js',
        filename:'bundle.[name].dev.js',//[name]是变量
        path:path.resolve(__dirname,'dist'),//绝对路径
        // publicPath:'/'
    },
    devServer:{//服务器配置
        port:3000,
        progress:true,
        contentBase:'./dist',
        // compress:true
        proxy:{//代理到指定服务器
            // before(app){
            // },
            '/api':{
                target:"http://localhost:8080",
                pathRewrite:{'/api':''},

            }
        }
    },
})
//npm run build -- --config webpack.dev.config.js