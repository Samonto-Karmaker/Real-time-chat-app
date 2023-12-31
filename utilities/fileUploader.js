//external imports
const multer = require("multer")
const path = require("path")
const createError = require("http-errors")

//For single file upload handling
const singleFileUploader = (floderName, fileType, maxSize, err) => {
    //file upload folder
    const upload_folder = `${__dirname}/../public/uploads/${floderName}/`

    //Storage Config
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, upload_folder)
        },
        filename: (req, file, cb) => {
            //separating the extension from the file
            const ext = path.extname(file.originalname)
            //formatting the file name
            const name = 
                file.originalname
                    .replace(ext, "")
                    .toLowerCase()
                    .split(" ")
                    .join("-") + "-" + Date.now()
            //finalizing the filename with extension
            cb(null, name, ext)
        }
    })

    //final upload object
    const upload = multer({
        storage: storage,
        limits: {
            fileSize: maxSize
        },
        fileFilter: (req, file, cb) => {
            if(fileType.includes(file.mimetype)){
                //Accept the file
                cb(null, true)
            }
            else{
                //Throw an error. err => error message
                cb(createError(err))
            }
        }
    })

    return upload
}

//For multiple file upload handling
const multiFileUploader = (floderName, fileType, maxSize, fileNum, err) => {
    //File upload folder
    const upload_folder = `${__dirname}/../public/uploads/${floderName}/`

    //Configuring storage
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, upload_folder)
        },
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname)
            const name = 
                file.originalname
                    .replace(ext, "")
                    .toLowerCase()
                    .split(" ")
                    .join("-") + "-" + Date.now()
            cb(null, name + ext)
        }
    })
    
    //Final uploads object
    const uploads = multer({
        storage: storage,
        limits: {
            fileSize: maxSize
        },
        fileFilter: (req, file, cb) => {
            if(req.files.length > fileNum){
                //If the number of files exceed the limit
                cb(
                    createError(
                        `You can only upload ${fileNum} files at the same time`
                    )
                )
            }
            else{
                if(fileType.includes(file.mimetype)){
                    cb(null, true)
                }
                else{
                    cb(createError(err))
                }
            }
        }
    })
    return uploads
}

module.exports = {
    singleFileUploader,
    multiFileUploader
}