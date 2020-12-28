class FileListPlugin{
    constructor({filename}){
        this.filename = filename
    }
    apply(compiler){
        //emit
        compiler.hooks.emit.tap("FileListPlugin",(compilation)=>{
            
            let content = `文件名 资源大小`
            let assets = compilation.assets;
            // Object.entries(assets).forEach(ele=>{
            // })
            
            assets[this.filename] = {
                source(){
                    return content
                },
                size(){
                    return `${content}====`
                }
            }
            console.log("-->",compilation.assets);
            // setTimeout(()=>{
            //     console.log("等一下,编译完成");
            //     cb()
            // },1000)
        })
    }
}
module.exports = FileListPlugin