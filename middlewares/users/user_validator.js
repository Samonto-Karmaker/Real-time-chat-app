//External Imports
const {check, validationResult} = require("express-validator")
const createError = require("http-errors")
const path = require("path");
const { unlink } = require("fs");

//Internal Imports
const actors = require("../../models/actors")

/**
 * Add user validator array. Here we used check from express-validator. This is like a rubric for adding user.
 * To response to the error, we use a handler function which can handle the validation result.
 * We used .custom to create a custom validator for emails and moblie numbers. 
 * Here, the custom validator ensures that email and moblie are unique.
 */
const addUserValidators = [
    check("name")
        .isLength({min: 1})
        .withMessage("NameError: Length of Name can't be 0")
        .matches(/^[a-zA-Z][a-zA-Z\s-_]+$/)
        .withMessage("NameError: Name must start with an alphabet and should only contain alphabets, whitespaces, - and _")
        .trim(),
    check("email")
        .isEmail()
        .withMessage("EmailError: Invaild Email Address")
        .trim()
        .custom(async (value) =>{
            try{
                const actor = await actors.findOne({email: value})
                if(actor){
                    throw createError("EmailError: Email must be unique")
                }
            }
            catch(err){
                throw createError(err.message)
            }
        }),
    check("mobile")
        .isMobilePhone("bn-BD", {strictMode: true})
        .withMessage("MobileError: Mobile Number must be vaild & Bangladeshi")
        .custom(async (value) =>{
            try{
                const actor = await actors.findOne({mobile: value})
                if(actor){
                    throw createError("MobileError: Mobile Number must be unique")
                }
            }
            catch(err){
                throw createError(err.message)
            }
        }),
    check("password")
        .isStrongPassword()
        .withMessage("Password must be at least 8 characters long & should contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol")    
]

//This function is used to handle the validation result.
const validationResultHandler = (req, res, next) => {
    //Get the errors
    const errors = validationResult(req)
    console.log(errors)
    //Beautify the errors
    const mappedErrors = errors.mapped()
    console.log(mappedErrors)
    if(Object.keys(mappedErrors).length === 0){
        //No error found
        next()
    }
    else{
        //Delect avatar if uploaded any
        if(req.files.length > 0){
            const {filename} = req.files[0]
            unlink(
                path.join(__dirname, `/../../public/uploads/avatars/${filename}`),
                (err) => {
                    if(err){
                        console.log(err)
                    }
                }
            )
        }
        //Send a json response
        res.status(500).json({
            errors: mappedErrors
        })
    }
}

module.exports = {
    addUserValidators,
    validationResultHandler
}