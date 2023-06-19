const mongoose = require("mongoose")

const messageSchema = mongoose.Schema(
    {
        text: String,
        attachment: [String],
        sender: {
            id: mongoose.Types.ObjectId,
            name: String,
            avatar: String,
        },
        receiver: {
            id: mongoose.Types.ObjectId,
            name: String,
            avatar: String,
        },
        date_time: {
            type: Date,
            default: Date.now
        },
        conversation_id: {
            type: mongoose.Types.ObjectId,
            required: true
        }
    },
    {
        timestamps: true
    }
)

const messages = mongoose.model("messages", messageSchema)
module.exports = messages