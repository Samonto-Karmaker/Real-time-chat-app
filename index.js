//External Imports
const express = require("express")
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const path = require("path")
const cookieParser = require("cookie-parser")
const http = require("http")
const moment = require("moment")

//Internal Imports
const {notFoundErrorHandler, errorHandler} = require("./middlewares/common/error_handle")
const logInRouter = require("./routes/logInRouter")
const userRouter = require("./routes/userRouter")
const inboxRouter = require("./routes/inboxRouter")

//Initialization
const app = express()
const server = http.createServer(app) // Only for websocket config
dotenv.config()

//socket create
const io = require("socket.io")(server)
global.io = io

//set "moment" in app locals
app.locals.moment = moment

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
app.use("/", logInRouter)
app.use("/users", userRouter)
app.use("/inbox", inboxRouter)

//Error Handling

//404: Not Found
app.use(notFoundErrorHandler)

//Defult Error Handler
app.use(errorHandler)

//Listening
app.listen(process.env.PORT, () => {
    console.log(`App is listening to port ${process.env.PORT}`)
})