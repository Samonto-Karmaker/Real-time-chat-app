//External Import
const jwt = require("jsonwebtoken")
const createError = require("http-errors")

//If user tries to go "/" after login, redirect him to inbox
const redirectLoggedIn = (req, res, next) => {
    //If user is no logged in, cookies = null
    let cookies = Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null
    if(cookies){
        res.redirect("/inbox")
    }
    else{
        next()
    }
}

//If user tries to go the "/user" or "/inbox", we need to check if he is logged in
const checkLogin = (req, res, next) => {
    let cookies = Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null
    if(cookies){
        try{
            //get the jwt token
            token = cookies[process.env.COOKIE_NAME]

            //get the userObject
            const decodedUserInfo = jwt.verify(token, process.env.JWT_SECRET)

            //For API response
            req.user = decodedUserInfo

            //For HTML response
            if(res.locals.html){
                res.locals.loggedInUser = decodedUserInfo
            }
            next()
        }
        catch(err){
            if(res.locals.html){
                //For HTML response
                res.redirect("/")
            }
            else{
                //For API response
                res.status(500).json({
                    errors: {
                        common: {
                            msg: "Authentication Failure!"
                        }
                    }
                })
            }
        }
    }
    else{
        res.status(500).json({
            errors: {
                common: {
                    msg: "Authentication Failure!"
                }
            }
        })
    }
}

//Check if user is authorized to access the route
const roleAuth = roles => {
    return (req, res, next) => {
        if(roles.includes(req.user.role)){
            next()
        }
        else{
            if(res.locals.html){
                //For HTML response
                next(createError(401, "Not Authorized!"))
            }
            else{
                //For API response
                res.status(401).json({
                    errors: {
                        common: {
                            msg: "Not Authorized!"
                        }
                    }
                })
            }
        }
    }
}

module.exports = {
    redirectLoggedIn,
    checkLogin,
    roleAuth
}