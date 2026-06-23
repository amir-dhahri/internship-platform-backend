const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            default: "",
        },

        status: {
            type: String,
            enum: ["todo", "inProgress", "done"],
            default: "todo",
        },

        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AcademicSupervisor",
            required: true,
        },

        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },
    },
    { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;