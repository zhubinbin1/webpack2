
let loaderUtils = require('loader-utils')
let {validate} = require('schema-utils')
let fs = require('fs')
function loader(source){
    console.log("bannel-loader");
    this.cacheable && this.cacheable()
    let opts = loaderUtils.getOptions(this)
    let cb = this.async()
    let schema = {
        type:"object",
        properties:{
            text:{
                type:'string'
            },
            filename:{
                type:'string'
            }
        }
    }
    validate(opts,schema,'banner-loader');
    if(opts.filename){
        this.addDependency(opts.filename)
        fs.readFile(opts.filename,'utf8',function(err,data){
            cb(err,`/**${data}**/ ${source}`)
        })
    }else{
        cb(null,`/**${opts.text}**/ ${source}`)
    }

    return source
}
// loader.pitch =function(){
//     console.log("loader1 pitch======");
// }

module.exports=loader