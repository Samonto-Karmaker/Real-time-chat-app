//External imports
const createError = require("http-errors")

//Internal imports
const conversations = require("../models/conversations")
const actors = require("../models/actors")
const messages = require("../models/messages")
const escape = require("../utilities/escape")

//get inbox page
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
    //+88 is not required while searching
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
                    {mobile: mobile_search_regex},
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

//add conversation
const addConversation = async (req, res, next) => {
    try{
        const newCon = new conversations({
            creator: {
                id: req.user.userid,
                name: req.user.username,
                avatar: req.user.avatar || null
            },
            participant: {
                id: req.body.id,
                name: req.body.participant,
                avatar: req.body.avatar || null
            }
        })
        const result = await newCon.save()
        res.status(200).json({
            message: "A new conversation was added successfully"
        })
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

//Get messages
const getMessage = async (req, res, next) => {
    try{
        const message = await messages.find({
            conversation_id: req.params.conversation_id
        }).sort("-createdAt")

        const {creator, participant} = await conversations.findById(
            req.params.conversation_id
        )

        res.status(200).json({
            data: {
                messages: message,
                participant,
                creator
            },
            user: req.user.userid,
            conversation_id: req.params.conversation_id
        })
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

//send message
const sendMessage = async (req, res, next) => {
    if(req.body.message || (req.files && req.files.length > 0)){
        //If a message or attachments are there to send
        try{
            //prepare attachment to save in database if any
            let attachments = null
            if(req.files && req.files.length > 0){
                attachments = []
                req.files.forEach(file => {
                    attachments.push(file.filename)
                });
            }

            //save messages & attachments in database
            const newMessage = new messages({
                text: req.body.message,
                attachment: attachments,
                sender: {
                    id: req.user.userid,
                    name: req.user.username,
                    avatar: req.user.avatar || null
                },
                receiver: {
                    id: req.body.receiverId,
                    name: req.body.receiverName,
                    avatar: req.body.avatar || null
                },
                conversation_id: req.body.conversationId
            })
            const result = await newMessage.save()

            //Emit socket event: sending the data to frontend in realtime
            global.io.emit("new_message", {
                message: {
                    conversation_id: req.body.conversationId,
                    sender: {
                        id: req.user.userid,
                        name: req.user.username,
                        avatar: req.user.avatar || null
                    },
                    message: req.body.message,
                    attachment: attachments,
                    data_time: result.data_time
                }
            })

            res.status(200).json({
                message: "Message is sent successfully",
                data: result
            })
        }
        catch(err){
            res.status(500).json({
                errors: {
                    common: {
                        msg: "Message is not sent properly"
                    }
                }
            })
        }
    }
}

//delete message
const deleteConversation = async (req, res, next) => {
    try{
        const result = await conversations.findByIdAndDelete(req.params.conversation_id)
        global.io.emit("delete_conversation", req.params.conversation_id)
        res.status(200).json({
            message: "Conversation is deleted successfully"
        })
    }
    catch(err){
        res.status(500).json({
            errors: {
                common: {
                    msg: "Conversation is not deleted properly"
                }
            }
        })
    }
}

module.exports = {
    getInboxInfo,
    searchUser,
    addConversation,
    getMessage, 
    sendMessage,
    deleteConversation
}