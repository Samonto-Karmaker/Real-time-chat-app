//External Imports
const express = require("express")

//Internal Imports
const {
    getInboxInfo, 
    searchUser, 
    addConversation, 
    getMessage, 
    sendMessage, 
    deleteConversation,
    searchConversation
} = require("../controllers/inboxController")

const addTitle2HTMLResponse = require("../middlewares/common/decorate_html_reponse")
const { checkLogin } = require("../middlewares/common/protectPages")
const attachmentUploader = require("../middlewares/inbox/attachment_uploader")

//Initializing Router
const router = express.Router()

//Get Controller
router.get("/", addTitle2HTMLResponse("Inbox"), checkLogin, getInboxInfo)

//Search user
router.post("/search", checkLogin, searchUser)

//Add conversation
router.post("/add_conversation", checkLogin, addConversation)

//Get messages
router.get("/messages/:conversation_id", checkLogin, getMessage)

//Send message
router.post("/message", checkLogin, attachmentUploader, sendMessage)

//Delete conversation
router.delete("/conversation/:conversation_id", checkLogin, deleteConversation)

//Search conversation
router.post("/search_conversation", checkLogin, searchConversation)

module.exports = router