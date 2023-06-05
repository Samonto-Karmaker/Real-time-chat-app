//External Imports
const express = require("express")

//Internal Imports
const {getUsers, addUser, removeUser} = require("../controllers/userController")
const addTitle2HTMLResponse = require("../middlewares/common/decorate_html_reponse")
const avatarUploader = require("../middlewares/users/avatar_uploader")
const { addUserValidators, validationResultHandler } = require("../middlewares/users/user_validator")

//Initializing Router
const router = express.Router()

//Get Controller
router.get("/", addTitle2HTMLResponse("Users"), getUsers)

//Add users
router.post("/", avatarUploader, addUserValidators, validationResultHandler, addUser)

//Remove users
router.delete("/:id", removeUser)

module.exports = router