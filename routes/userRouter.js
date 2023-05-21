//External Imports
const express = require("express")

//Internal Imports
const {getUsers} = require("../controllers/userController")
const addTitle2HTMLResponse = require("../middlewares/common/decorate_html_reponse")
const avatarUploader = require("../middlewares/users/avatar_uploader")

//Initializing Router
const router = express.Router()

//Get Controller
router.get("/", addTitle2HTMLResponse("Users"), getUsers)

//Add users
router.post("/", avatarUploader)

module.exports = router