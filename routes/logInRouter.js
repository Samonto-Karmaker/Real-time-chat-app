//External Imports
const express = require("express")

//Internal Imports
const {getLoginPage, login, logout} = require("../controllers/loginController")
const addTitle2HTMLResponse = require("../middlewares/common/decorate_html_reponse")
const { logInValidators, validationResultHandler } = require("../middlewares/login/login_validator")

//Initializing Router
const router = express.Router()

//Get Controller
router.get("/", addTitle2HTMLResponse("Login"), getLoginPage)

//User authentication
router.post("/", addTitle2HTMLResponse("Login"), logInValidators, validationResultHandler, login)

//Logout
router.delete("/", logout)

module.exports = router