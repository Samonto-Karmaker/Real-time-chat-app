//External Imports
const express = require("express")

//Internal Imports
const {getInboxInfo, searchUser} = require("../controllers/inboxController")
const addTitle2HTMLResponse = require("../middlewares/common/decorate_html_reponse")
const { checkLogin } = require("../middlewares/common/protectPages")

//Initializing Router
const router = express.Router()

//Get Controller
router.get("/", addTitle2HTMLResponse("Inbox"), checkLogin, getInboxInfo)

//Search user
router.post("/search", checkLogin, searchUser)

module.exports = router