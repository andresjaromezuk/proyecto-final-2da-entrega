import multer from 'multer'
import path from 'path'
import __dirname from '../util.js'

export default function multerMiddleware(folder, entity){ 

    const storage = multer.diskStorage({
        destination : function(req,file,cb){
            cb(null,path.join(__dirname,'../static/' + folder));
        },

        filename : function(req,file,cb){
            cb(null, `img${entity}_${Date.now()}${path.extname(file.originalname)}`)
        }
    });

        return multer({storage});   

}

