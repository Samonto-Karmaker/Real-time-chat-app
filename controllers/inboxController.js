//External imports
const createError = require("http-errors")

//Internal imports
const conversations = require("../models/conversations")
const actors = require("../models/actors")
const escape = require("../utilities/escape")

//get indox page
const getInboxInfo = async (req, res, next) => {
    try{
        //trying to get conversations if exists
        const conversation = await conversations.find({
            $or: [
                {"creator.id": req.user.userid},
                {"participant.id": req.user.userid}
            ]
        })
        res.locals.data = conversation
        res.render("inbox")
    }
    catch(err){
        next(err)
    }
}

//search user
const searchUser = async (req, res, next) => {
    //get the query
    const user = req.body.user
    //+88 is not required whlie searching
    const searchQuery = user.replace("+88", "")

    //search regex
    //user can be searched by his name, email or mobile number
    const name_search_regex = new RegExp(escape(searchQuery), "i")
    const mobile_search_regex = new RegExp("^" + escape("+88" + searchQuery))
    const email_search_regex = new RegExp("^" + escape(searchQuery) + "$", "i")

    try{
        if(searchQuery !== ""){
            //Query to get the name and avatar of the user
            const user = await actors.find({
                $or: [
                    {name: name_search_regex},
                    {moblie: mobile_search_regex},
                    {email: email_search_regex}
                ]
            }, "name avatar")
            res.json(user)
        }
        else{
            throw createError("Search bar is empty!")
        }
    }
    catch(err){
        res.status(500).json({
            errors: {
                common: {
                    msg: err.message
                }
            }
        })
    }
}

module.exports = {
    getInboxInfo,
    searchUser
}