//External Import
const jwt = require("jsonwebtoken")

//If user trys to go "/" after login, redirect him to inbox
const redirectLoggedIn = (req, res, next) => {
    //If user is no loggedin, cookies = null
    let cookies = Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null
    if(cookies){
        res.redirect("/inbox")
    }
    else{
        next()
    }
}

//If user trys to go the "/user" or "/inbox", we need to check if he is logged in
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

module.exports = {
    redirectLoggedIn,
    checkLogin
}