//External imports
const mongoose = require("mongoose")

//Schema Design
const actorSchema = mongoose.Schema(
    {
        name: {
            type: String,
            require: true,
            trim: true
        },
        email: {
            type: String,
            require: true,
            lowercase: true,
            trim: true
        },
        moblie: {
            type: String,
            require: true,
            trim: true
        },
        password: {
            type: String,
            require: true
        },
        avatar: {
            type: String
        },
        role: {
            type: String,
            enum: ["admin", "user"],
            default: "user"
        },
    },
    {
        timestamps: true
    }
)

//Model Creation
const actors = mongoose.model("actors", actorSchema)

module.exports = actors