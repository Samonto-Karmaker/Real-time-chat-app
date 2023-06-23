//External imports
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const createError = require("http-errors")

//Internal import
const actors = require("../models/actors")

//Get login page
const getLoginPage = (req, res, next) => {
    res.render("login")
}

//Login
const login = async (req, res, next) => {
    try {
        //find a user with the given email or mobile number
        const user = await actors.findOne({
            $or: [{email: req.body.username}, {mobile: req.body.username}]
        })
        if(user && user._id){
            //check if the password is valid
            const isValidPassword = await bcrypt.compare(
                req.body.password,
                user.password
            )
            if(isValidPassword){
                //prepare the user object to generate a jw token
                //only provide public info as it is accessable
                const userObject = {
                    userid: user._id,
                    username: user.name,
                    email: user.email,
                    mobile: user.mobile,
                    avatar: user.avater || null,
                    role: user.role || "user"
                }
                //Generate token
                const token = jwt.sign(userObject, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRY
                })
                //Set the cookie
                res.cookie(process.env.COOKIE_NAME, token, {
                    maxAge: process.env.JWT_EXPIRY,
                    httpOnly: true,
                    signed: true
                })
                //Set logged in user local identifier
                res.locals.loggedInUser = userObject
                res.render("inbox")
            }
            else{
                throw createError("LogInError: Invalid password")
            }
        }
        else{
            throw createError("LogInError: Unknown username")
        }
    } 
    catch (err) {
        res.render("login", {
            data: {
                //So that user doesn't need to rewrite the username
                username: req.body.username
            },
            errors: {
                common: {
                    msg: err.message
                }
            }
        })
    }
}

//Logout
const logout = (req, res, next) => {
    res.clearCookie(process.env.COOKIE_NAME)
    res.send("logged out")
}

module.exports = {
    getLoginPage,
    login,
    logout
}