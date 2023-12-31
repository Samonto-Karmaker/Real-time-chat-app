//Internal imports
const {multiFileUploader} = require("../../utilities/fileUploader")

const attachmentUploader = (req, res, next) => {
    const uploader = multiFileUploader(
        "attachments",
        ["image/jpeg", "image/jpg", "image/png"],
        1000000,
        3,
        "Only .jpg or .jpeg or png format supported"
    )
    uploader.any()(req, res, (err) => {
        if(err){
            res.status(500).json({
                errors:{
                    common:{
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

module.exports = attachmentUploader