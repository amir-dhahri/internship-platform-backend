require("dotenv").config()
const http = require("http")
const app = require("./app/app")
require("./config/dbConnect");
const PORT = process.env.PORT || 2026; 


//=====Server=====//

const server = http.createServer(app);

server.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}`);
})