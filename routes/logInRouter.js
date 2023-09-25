//External Imports
const express = require("express")

//Internal Imports
const {getLoginPage, login, logout} = require("../controllers/loginController")
const addTitle2HTMLResponse = require("../middlewares/common/decorate_html_reponse")
const { logInValidators, loginValidationResultHandler } = require("../middlewares/login/login_validator")
const {redirectLoggedIn} = require("../middlewares/common/protectPages")

// Reusing middlewares from userController for signing up users
const {addUser} = require("../controllers/userController")
const avatarUploader = require("../middlewares/users/avatar_uploader")
const { addUserValidators, userValidationResultHandler } = require("../middlewares/users/user_validator")

//Initializing Router
const router = express.Router()

//Get Controller
router.get("/", addTitle2HTMLResponse("Login"), redirectLoggedIn, getLoginPage)

//User authentication
router.post("/", addTitle2HTMLResponse("Login"), logInValidators, loginValidationResultHandler, login)

//Sign Up
router.post(
    "/signup", 
    avatarUploader, 
    addUserValidators, 
    userValidationResultHandler, 
    addUser
)

//Logout
router.delete("/", logout)

module.exports = router