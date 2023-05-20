//External Imports
const express = require("express")

//Internal Imports
const {getInboxInfo} = require("../controllers/inboxController")
const addTitle2HTMLResponse = require("../middlewares/common/decorate_html_reponse")

//Initializing Router
const router = express.Router()

//Get Controller
router.get("/", addTitle2HTMLResponse("Inbox"), getInboxInfo)

module.exports = router