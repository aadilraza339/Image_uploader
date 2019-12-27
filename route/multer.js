var multer  =  require('multer');
module.exports=multer({
    storage:multer.diskStorage({}),
    fileFilter:(req,file,Cb)=>{
        if(!file.mimetype.match(/jpe|jpeg|png|gif$i/)){
            Cb(new Error('file is not supported'),false)
            return
        }
        Cb(null,true)
    }
})