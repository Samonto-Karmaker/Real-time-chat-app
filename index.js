//Imports
const express = require("express")
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const path = require("path")
const cookieParser = require("cookie-parser")

//Initialization
const app = express()
dotenv.config()

//Database connection
mongoose.connect(process.env.DATABASE_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Database Connection Successful"))
.catch(err => console.log(err))

//Request Parsers
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//Set view engine
app.set("view engine", "ejs")

//Set static folder
app.use(express.static(path.join(__dirname, "public")))

//Cookie Parser
app.use(cookieParser(process.env.COOKIE_SECRET))

//Routing

//Error Handling

//Listening
app.listen(process.env.PORT, () => {
    console.log(`App is listening to port ${process.env.PORT}`)
})