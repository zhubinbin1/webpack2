
let path = require('path')
let HtmlWebpackPlugin = require('html-webpack-plugin')
let MiniCssExtractPlugin = require('mini-css-extract-plugin')
let OptimizeCssWebpackPlugin = require('optimize-css-assets-webpack-plugin')
let uglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin')
let {CleanWebpackPlugin} = require('clean-webpack-plugin')
let CopyWebpackPlugin = require('copy-webpack-plugin')
let webpack =require('webpack')
//cleanWebpackPlugin清dist copyWebpackPlugin 拷贝 bannerPlugin 版权

module.exports = {
    mode:"production",//development production
    // entry:'./src/index.js',
    entry:{// 多入口是对象
        index:'./src/index.js',
        // other:'./src/other.js'
    },
    output:{
        // filename:'bundle.[hash:4].js',
        // filename:'bundle.js',
        filename:'bundle.[name].[hash].js',//[name]是变量
        path:path.resolve(__dirname,'dist'),//绝对路径
        // publicPath:'/'
    },
    // watch:true,
    // watchOptions:{
    //     poll:1000,//1s1000次
    //     aggregateTimeout:500,//防抖
    //     ignored:/node_modules/
    // },
    //eval-source-map 不会产生单独文件, cheap-mudule-source-map,不会产生列
    //不会产生文件,集成在打包后的文件中,不产生列
    devtool:'eval-cheap-module-source-map',//映射文件 eval-cheap-module-source-map
    resolve:{//属性配置
        modules:[
            path.resolve('node_modules')
        ],
        extensions:['.js','.css','.json','.vue'],
        // mainFields:['style','main'],//mainFiles:[]
        alias:{//别名
            //@:'./src'
        }
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
    plugins:[
        new webpack.DefinePlugin({//定义环境变量,配置文件
            DEV:'dev',
        }),
        new CleanWebpackPlugin({
            cleanAfterEveryBuildPatterns: ['./dist']
        }),
        new webpack.BannerPlugin({
            banner:'2020 祝彬彬'
        }) ,
        // new CopyWebpackPlugin( 
        //     {
        //         patterns:[
        //             {from:path.resolve(__dirname,'src'),to :'./'}
        //         ]
        //     }
        // ),
        new HtmlWebpackPlugin(
            {
                template:'./src/index.html',
                filename:'index.html',
                // minify:{
                //     removeAttributeQuotes:false,
                //     collapseInlineTagWhitespace:false,
                // },
                // hash:true,
                chunks:['index']
            }
        ),
        // new HtmlWebpackPlugin(
        //     {
        //         template:'./src/index.html',
        //         filename:'other.html',
        //         chunks:['other']
        //     }
        // ),
        new MiniCssExtractPlugin({
            // filename:'main.[hash:4].css',
            filename:'css/main.css',
        }),
        //向模块提供第三方
        new webpack.ProvidePlugin({
            $:'jquery'
        }),
    ],
    externals:{
        //第三方模块,不进行打包
        'jquery':'$'
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
    module:{
        rules:[
            {
                test:/\.(png|jpg|gif)/,
                use:{
                    loader:'url-loader',//'file-loader'
                    options:{
                        limit:200*1024, //小此,转换base64
                        outputPath:'img',
                        publicPath:'/'//只有图片加载publicPath
                    }
                }
            },
            {
                test:/\.html/,
                use:'html-withimg-loader'
            },
            // {
            //     test:require.resolve('jquery'),
            //     use:'expose-loader?$'
            // },
            // { 
            //     test:/\.js$/,
            //     use:{
            //         loader:'eslint-loader',
            //         options:{
            //             enforce:'pre'
            //         }
            //     }
            // },
            {
                test:/\.js$/,
                use:{
                    loader:'babel-loader',
                    options:{
                        presets:[//es6-es5
                            '@babel/preset-env'
                        ],
                        plugins:[
                            '@babel/plugin-proposal-class-properties',
                             '@babel/plugin-transform-runtime'
                        ]
                    }
                },
                include:path.resolve(__dirname,'src'),
                exclude:/node_modules/
            },
            
            //规则 css loader-@import  style-loader 插入head ,  顺序右-左 sass stylus
            {
            test:/\.css$/, 
            use:[
            //     {
            //     loader:'style-loader',
            //     options:{
            //         insert:'body'//确保内部样式生效{ injectType?, attributes?, insert?, base?, esModule?, modules? }
            //     }
            // }, 
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
            ]},
            {
                test:/\.less$/, 
            use:[
            //     {
            //     loader:'style-loader',
            // }, 
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
            'less-loader',
            ]},
        ]
    }
}