let {merge} = require('webpack-merge')
let path = require('path')
let base = require('./webpack.base.config')
let MiniCssExtractPlugin = require('mini-css-extract-plugin')
let OptimizeCssWebpackPlugin = require('optimize-css-assets-webpack-plugin')
let uglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin')
module.exports = merge(base,{
    mode:'production',
    output:{
        // filename:'bundle.[hash:4].js',
        // filename:'bundle.js',
        filename:'bundle.[name].prod.js',//[name]是变量
        path:path.resolve(__dirname,'dist'),//绝对路径
        // publicPath:'/'
    },
    optimization:{//优化
        minimizer:[
            new OptimizeCssWebpackPlugin(),
            new uglifyjsWebpackPlugin(
                {
                    cache:true,
                    parallel:true,
                    sourceMap:true
                }
            )
        ]
    },
    plugins:[
        new MiniCssExtractPlugin({
            // filename:'main.[hash:4].css',
            filename:'css/main.css',
        }),
    ]
})
