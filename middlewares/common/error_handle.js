const createError = require("http-errors")

//404: Not Found
const notFoundErrorHandler = (req, res, next) => {
    next(createError(404, "Your Requested Content is Not Found :("))
}

//Defult Error Handler
const errorHandler = (err, req, res, next) =>{
    res.render("error", {
        "title": "error!"
    })
}

module.exports = {
    notFoundErrorHandler,
    errorHandler
}