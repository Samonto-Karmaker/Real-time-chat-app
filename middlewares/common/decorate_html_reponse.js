const addTitle2HTMLResponse = page_title => {
    return (req, res, next) => {
        res.locals.html = true
        res.locals.title = `${page_title} - ${process.env.APP_NAME}`
        //The following objects will be used on later middlewares.
        //They are added here just to prevent any unwanted errors.
        res.locals.loggedInUser = {}
        res.locals.data = {}
        res.locals.errors = {}
        next()
    }
}

module.exports = addTitle2HTMLResponse