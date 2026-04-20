require("dotenv").config()
const http = require("http")
const app = require("./app/app");
const cors = require("cors");
const { Server } = require("socket.io");
require("./config/dbConnect");
const PORT = process.env.PORT || 2026;


//=====Server=====//

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000/",
        methods: ["GET", "POST"]
    }
})

io.on("connection", async (socket) => {
    socket.on("connection", async (socket) => {
        console.log("Client Connected!");
    })
    socket.on("sendNotification", async (data) => {
        console.log(data);
        try {
            const notifications = [];
            for (const receiver of data.receivers) {
                const notif = await Notification.create({
                    ...data,
                    receiver
                });
                notifications.push(notif);
                io.to(receiver.toString()).emit("receiveNotification", notif)
            }
        } catch (error) {
            console.log("Error saving notification", error);
        }
    })
    socket.on("disconnect", async (socket) => {
        onsole.log("Client Disconnect!");
    })
})

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})