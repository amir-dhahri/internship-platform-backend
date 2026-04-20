require("dotenv").config()
const http = require("http")
const app = require("./app/app");
const cors = require("cors");
const { Server } = require("socket.io");
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
// make io accessible in controllers
app.set("io", io);

// ===== Socket connection ===== //
io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // join user room
    const userId = socket.handshake.query.userId;
    if (userId) {
        socket.join(userId);
    }

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

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});


// ===== Start server ===== //
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});