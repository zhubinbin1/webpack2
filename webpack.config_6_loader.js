
let path = require('path')
let HtmlWebpackPlugin = require('html-webpack-plugin')
let MiniCssExtractPlugin = require('mini-css-extract-plugin')
let OptimizeCssWebpackPlugin = require('optimize-css-assets-webpack-plugin')
let uglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin')
let {CleanWebpackPlugin} = require('clean-webpack-plugin')
let webpack =require('webpack')
//懒加载 
module.exports = {
    mode:"production",//development production
    entry:{// 多入口是对象
        index:'./src/index.js',
    },
    output:{
        filename:'bundle.js',
        path:path.resolve(__dirname,'dist'),//绝对路径
    },
    devtool:'source-map',
    watch:true,
    resolve:{//属性配置
        modules:[
            path.resolve('node_modules')
        ],
        extensions:['.js','.css','.json','.vue'],
        alias:{//别名
            //@:'./src'
        }
    },
    devServer:{//服务器配置
        port:3000,
        hot:true,
        progress:true,
        contentBase:'./dist',
        // compress:true
    },
    plugins:[
        new webpack.DllReferencePlugin({
            manifest:path.resolve(__dirname,'dll','manifest.json')
        }),
        new webpack.DefinePlugin({//定义环境变量,配置文件
            DEV:"'dev'",
        }),
        new webpack.IgnorePlugin({
            resourceRegExp: /^\.\/locale$/,
            contextRegExp: /moment$/
          }),
        new CleanWebpackPlugin({
            cleanAfterEveryBuildPatterns: ['./dist']
        }),
        // new webpack.NormalModuleReplacementPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin(
            {
                template:'./src/index.html',
                filename:'index.html',
                chunks:['index']
            }
        ),
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
        // splitChunks:{//抽离分割代码块
        //     cacheGroups:{//缓存组
        //         common:{//公共模块
        //             chunks:'initial',
        //             minSize:0,//大小
        //             minChunks:2,//次数
        //         },
        //         verdor:{
        //             priority:1,
        //             test:/node_modules/,
        //             chunks:'initial',
        //             minSize:0,//大小
        //             minChunks:2,//次数
        //         }
        //     }
        // },
        minimizer:[
            // new OptimizeCssWebpackPlugin(),
            // new uglifyjsWebpackPlugin(
            //     {
            //         cache:true,
            //         parallel:true,
            //         sourceMap:true
            //     }
            // )
        ]
    },
    resolveLoader:{
        modules:['node_modules',path.resolve(__dirname,'src/loaders')]
        // loader 别名
        // alias:{
        //     loader1:path.resolve(__dirname,'src/loaders/loader1.js')
        // }    
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
            {
                test:/\.js$/,
                exclude:/node_modules/,
                include:path.resolve(__dirname,'src'),
                use:{
                    loader:'babel-loader',
                    options:{
                        presets:[//es6-es5
                            '@babel/preset-env',
                            '@babel/preset-react',
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
        
            {
                // enforce:'pre',//pre normal inline  post
                test:/\.js$/,
                use:{
                    loader:path.resolve(__dirname,'src/loaders/banner-loader.js'),
                    options:{
                        text:"祝彬彬",
                        filename:path.resolve(__dirname,'src/loaders/banner.js')
                    }
                }
                // test:/\.js$/,
                // use:{
                //     loader:path.resolve(__dirname,'src/loaders/babel-loader.js'),
                //     options:{
                //         presets:[
                //             '@babel/preset-env'
                //         ]
                //     }
                // }
                // use:['loader1','loader2']
                // use:{
                //     loader:'loader1'
                // }
            },
            // {
            //     enforce:'pre',//pre normal inline  post
            //     test:/\.js$/,
            //     use:['loader1']
            //     // use:{
            //     //     loader:'loader1'
            //     // }
            // },
            
            //规则 css loader-@import  style-loader 插入head ,  顺序右-左 sass stylus
            {
            test:/\.css$/, 
                use:[
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                ]
            },
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