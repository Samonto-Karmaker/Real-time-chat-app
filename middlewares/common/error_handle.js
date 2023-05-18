const createError = require("http-errors")

//404: Not Found
const notFoundErrorHandler = (req, res, next) => {
    next(createError(404, "Your Requested Content is Not Found :("))
}

//Defult Error Handler
const errorHandler = (err, req, res, next) =>{
    res.locals.error = err
    res.status = (err.status || 500)

    if(res.locals.html){
        //Send HTML response
        res.render("error", {
            "title" : "Error!!"
        })
    }
    else{
        //Send JSON response
        res.json(res.locals.error)
    }
}

module.exports = {
    notFoundErrorHandler,
    errorHandler
}