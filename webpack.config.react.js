
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
    mode:"development",//development production
    entry:{// 多入口是对象
        react:['react','react-dom']
    },
    output:{
        filename:'_dll_[name].js',//[name]是变量
        path:path.resolve(__dirname,'dll'),//绝对路径
        library:'_dll_[name]',
        // libraryTarget:'umd',//var
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
    plugins:[
        new webpack.DllPlugin({
            name:'_dll_[name]',
            path:path.resolve(__dirname,'dll','manifest.json')
        }),
        // new CleanWebpackPlugin({
        //     cleanAfterEveryBuildPatterns: ['./dist']
        // }),
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
        // noParse:/jquery/, //不去解析jquery依赖库
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