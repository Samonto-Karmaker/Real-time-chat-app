//External imports

//Internal imports
const conversations = require("../models/conversations")

const getInboxInfo = async (req, res, next) => {
    try{
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

module.exports = {
    getInboxInfo
}