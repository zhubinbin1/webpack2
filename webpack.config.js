
let path = require('path')
let HtmlWebpackPlugin = require('html-webpack-plugin')
let {CleanWebpackPlugin} = require('clean-webpack-plugin')
let DonePlugin = require('./plugins/DonePlugin')
let AsyncPlugin = require('./plugins/AsyncPlugin')
let FileListPlugin = require('./plugins/FileListPlugin')
module.exports = {
    mode:"development",//development production
    entry:{// 多入口是对象
        index:'./src/index.js',
    },
    output:{
        filename:'bundle.js',
        path:path.resolve(__dirname,'dist'),//绝对路径
    },
    devtool:'source-map',
    watch:false,
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
        new DonePlugin(),
        new FileListPlugin({filename:'list.md'}),
        new AsyncPlugin(),
        new CleanWebpackPlugin({
            cleanAfterEveryBuildPatterns: ['./dist']
        }),
        new HtmlWebpackPlugin(
            {
                template:'./src/index.html',
                filename:'index.html',
                chunks:['index']
            }
        ),
    ],
    resolveLoader:{
        modules:['node_modules',path.resolve(__dirname,'src/loaders')]
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
            },
            //规则 css loader-@import  style-loader 插入head ,  顺序右-左 sass stylus
            {
            test:/\.css$/, 
                use:[
                    'css-loader',
                    'postcss-loader',
                ]
            },
            {
                test:/\.less$/, 
            use:[
            'css-loader',
            'postcss-loader',
            'less-loader',
            ]},
        ]
    }
}