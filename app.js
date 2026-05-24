// Express Library
const express = require("express");
// Cors Library
const cors = require("cors");
// Dotenv Library
const dotenv = require("dotenv");
const http = require("http");
const {Server} = require("socket.io")
// Dotenv ON
dotenv.config();
// Connect DB With Server
const connectDB = require("./config/db");
connectDB();
// Create Server
const app = express();
// Json Data
app.use(express.json());
// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
const server = http.createServer(app);
const io = new Server (server, {
  cors: {
    origin: "http://localhost:5173"
  },
});
io.on("connection", (socket) => {
  console.log("Client Connected:", socket.id)
})
app.set("io", io)
// Connect User Routes With Server 
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);
// Connect Ticket Routes With Server 
const ticketRoutes = require("./routes/ticketRoutes");
app.use("/api/tickets", ticketRoutes);
// Connect Device Routes With Server 
const deviceRoutes = require("./routes/deviceRoutes");
app.use("/api/devices", deviceRoutes);
// Turn ON Function automaticlly >> Devices Ping automaticlly
const cron = require("node-cron");
const checkDevices = require("./services/networkMonitor");
cron.schedule("*/1 * * * *", async () => {
  const io = app.get("io")
  await checkDevices(io);
});
// Create Route
app.get("/", (req, res) => {
    res.send("Smart IT System API is running...");
});
// Create Port
const PORT = process.env.PORT || 5000;
// Server ON
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})