//External imports
const bcrypt = require("bcrypt")
const unlink = require("fs")
const path = require("path")

//Internal imports
const actors = require("../models/actors")

//Get user list from the datadase
const getUsers = async (req, res, next) => {
    try {
        const users = await actors.find()
        res.render("users", {
            users: users
        })
    } 
    catch (err) {
        next(err)
    }
}

//Add user
const addUser = async (req, res, next) => {
    let newUser
    const encryptedPassword = await bcrypt.hash(req.body.password, 12)
    
    if(req.files && req.files.length > 0){
        newUser = new actors({
            ...req.body,
            avatar: req.files[0].filename,
            password: encryptedPassword
        })
    }
    else{
        newUser = new actors({
            ...req.body,
            password: encryptedPassword
        })
    }

    //Save user or throw an error
    try{
        const result = await newUser.save()
        res.status(200).json({
            message: "User was added successfully"
        })
    }
    catch(err){
        res.status(500).json({
            errors: {
                common:{
                    msg: "Unknown error occured"
                }
            }
        })
    }
}

//Remove user
const removeUser = async (req, res, next) => {
    try {
        //Get the deleted user
        const user = await actors.findByIdAndDelete({
            _id: req.params.id
        })
        //Remove deleted user avatar
        if(user.avatar){
            unlink(
                path.join(__dirname, `/../public/uploads/avatars/${user.avatar}`),
                (err) => {
                    if(err){
                        console.log(err)
                    }
                }
            )
        }
        res.status(200).json({
            message: "User was removed successfully"
        })
    } 
    catch (err) {
        res.status(500).json({
            errors: {
                common: {
                    msg: "RemoveError: Could not remove the user"
                }
            }
        })
    }
}

module.exports = {
    getUsers,
    addUser,
    removeUser
}