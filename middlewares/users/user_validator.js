//External Imports
const {check} = require("express-validator")
const createError = require("http-errors")

//Internal Imports
const actors = require("../../models/actors")

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
    check("moblie")
        .isMobilePhone("bn-BD", {strictMode: true})
        .withMessage("MobileError: Moblie Number must be vaild & Bangladeshi")
        .custom(async (value) =>{
            try{
                const actor = await actors.findOne({mobile: value})
                if(actor){
                    throw createError("EmailError: Email must be unique")
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

module.exports = {
    addUserValidators
}