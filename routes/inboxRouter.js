//External Imports
const express = require("express")

//Internal Imports
const {getInboxInfo} = require("../controllers/inboxController")

//Initializing Router
const router = express.Router()

//Get Controller
router.get("/", getInboxInfo)

module.exports = router