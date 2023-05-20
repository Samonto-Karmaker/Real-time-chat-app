//External Imports
const express = require("express")

//Internal Imports
const {getUsers} = require("../controllers/userController")

//Initializing Router
const router = express.Router()

//Get Controller
router.get("/", getUsers)

module.exports = router