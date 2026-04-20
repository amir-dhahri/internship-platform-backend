import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        receivers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
            }
        ],
        type: {
            type: String,
            enum: ["PROJECT_COMPLETED", "MESSAGE", "SYSTEM"],
            required: true,
        },

        entity: {
            type: String, // e.g. "StageNet Platform"
        },

        entityType: {
            type: String, // e.g. "Project"
        },

        message: {
            type: String, // optional fallback text
        },

        isRead: {
            type: Boolean,
            default: false,
        },

        senderPhoto: {
            type: String, // for quick display (optional optimization)
        },
    },
    {
        timestamps: true, // gives you createdAt (for "5 min ago")
    }
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;