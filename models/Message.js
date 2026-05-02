const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        roomId: {
            type: String,
            required: false,
            index: true, // for faster queries
        },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        text: {
            type: String,
            required: true,
            trim: true,
        },
        attachments: [
            {
                url: String,
            },
        ],
        readBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;