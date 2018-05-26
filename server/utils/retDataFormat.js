function retDataFormat(message){
    //如果传入的是一个err对象的话，说明失败
    if(message instanceof Error){
        return {
            retCode:0,
            success:false,
            message:err.message
        }
    }else{
        return {
            retCode:1,
            success:true,
            message:'success',
            data:message
        }
    }
}

module.exports = retDataFormat;