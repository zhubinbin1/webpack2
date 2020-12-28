class AsyncPlugin{
    apply(compiler){
        compiler.hooks.emit.tapAsync("AsyncPlugin",(compilation,cb)=>{
            setTimeout(()=>{
                console.log("等一下,编译完成");
                cb()
            },1000)
        })
        compiler.hooks.emit.tapPromise("AsyncPlugin",(compilation)=>{
            return new Promise((resolve,reject)=>{
                setTimeout(()=>{
                    console.log("等一下 tapPromise ,编译完成");
                    resolve()
                },1000)
            })
        })
    }
}
module.exports = AsyncPlugin