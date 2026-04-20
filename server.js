require("dotenv").config()
const http = require("http")
const app = require("./app/app");
// const cors = require("cors");
const { Server } = require("socket.io");
const socketIoAuth = require("./middlewares/socketioAuth");
require("./config/dbConnect");
const PORT = process.env.PORT || 2026;


//=====Server=====//
const server = http.createServer(app);

// ===== Socket.IO ===== //
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
    },
});
io.use(socketIoAuth);
// make io accessible in controllers
app.set("io", io);

// ===== Socket connection ===== //
io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    const userId = socket.user.id;

    socket.join(userId);

    console.log("User joined room:", userId);

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });

    // // optional: keep this ONLY if you want direct socket triggering
    // socket.on("sendNotification", async (data) => {
    //     try {
    //         for (const receiver of data.receivers) {
    //             io.to(receiver.toString()).emit("receiveNotification", data);
    //         }
    //     } catch (error) {
    //         console.log("Socket error:", error);
    //     }
    // });
});


// ===== Start server ===== //
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});