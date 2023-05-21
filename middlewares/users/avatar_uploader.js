//Internal Imports
const singleFileUploader = require("../../utilities/fileUploader")

const avatarUploader = (req, res, next) => {
    //get the upload multer object
    const upload = singleFileUploader(
        "avatars", 
        ["image/jpg", "image/jpeg", "image/png"], 
        1000000, 
        "Only .jpg or .jpeg or png format supported"
    )

    //call the middleware function
    upload.any()(req, res, (err) => {
        if(err){
            res.status(500).json({
                errors: {
                    avatar: {
                        msg: err.message
                    }
                }
            })
        }
        else{
            next()
        }
    })
}

module.exports = avatarUploader