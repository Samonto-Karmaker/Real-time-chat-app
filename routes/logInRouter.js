//External Imports
const express = require("express")

//Internal Imports
const {getLoginPage} = require("../controllers/loginController")

//Initializing Router
const router = express.Router()

//Get Controller
router.get("/", getLoginPage)

module.exports = router