import express from "express";
import connectDB from "./database/db.js";
import cors from 'cors';
import dotenv from "dotenv";
import roles from './routes/role.route.js';
import register from './routes/register.route.js';
import login from './routes/login.route.js';
import uploadRoute from './routes/upload.route.js'; // Import the upload route
import { Server } from "socket.io";
import { createServer } from "http";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
});

let user=true
io.use((socket,next)=>{
    if(user) next()
})

io.on('connection', (socket) => {
    // console.log("User Connected");
    console.log("User Connected", socket.id);


    socket.on("message",({message,room})=>{
        console.log(message,room);
        // this will recive the entire circuit
        // io.emit('receive-message',data)
        io.to(room).emit('receive-message',message)
    })      


    // socket.broadcast.emit("welcome", ` ${socket.id} joined the server`);
    // socket.emit("welcome", `Hello!!! to the new Server ${socket.id}`);

    socket.on("disconnect",()=>{
        console.log("User Disconnected : " , socket.id);
    })
});

// Port and DB URL from environment variables or defaults
const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL || "mongodb://localhost:27017";

// Connect to the database
connectDB(DB_URL)
    .then(() => {
        console.log('Connected to database');
    })
    .catch((err) => {
        console.error('Failed to connect to database', err);
        process.exit(1); // Exit process with failure
    });

// Define routes
app.use("/roles", roles);
app.use("/user", register);
app.use("/user", login);
app.use("/upload", uploadRoute);

// Simple route for health check
app.get('/check', (req, res) => {
    res.send('Project is On');
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});




//io means entire circuit