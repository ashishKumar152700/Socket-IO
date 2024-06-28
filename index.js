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
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// console.log(__dirname, 'dirname');
// console.log(__filename, '__filename');

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());


app.get('/file', async (req, res) => {
    try {
      const filePath = path.join(__dirname, 'index.txt'); 
      const data = await fs.readFile(filePath, 'utf8');
      res.send(data);
      console.log(data);
    } catch (err) {
      res.status(500).send('Error reading the file.');
    }
  });

  app.post('/edit_file', async (req, res) => {
    try {
        // const newContent = "this is my text from code";
        console.log(req.body.newContent);
        const newContent = req.body.newContent + '\n'; 
        const filePath = path.join(__dirname, 'index.txt');
        console.log(filePath,"filepath");
        // await fs.writeFile(filePath, newContent, 'utf8');
        await fs.appendFile(filePath, newContent, 'utf8');

        res.send('File content updated successfully.');
    } catch (err) {
        res.status(500).send('Error writing to the file.');
    }
});


app.delete('/delete_file', async (req, res) => {
    try {
        const fileName = 'index.txt';
        const filePath = path.join(__dirname, fileName); // Full path to the file

        // Check if the file exists before attempting to delete
        const fileExists = await fs.access(filePath)
            .then(() => true)
            .catch(() => false);

        if (!fileExists) {
            return res.status(404).send('File not found.');
        }

        // Delete the file
        await fs.unlink(filePath);

        res.send(`File '${fileName}' deleted successfully.`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting the file.');
    }
});



app.get('/create_file', async (req, res) => {
    try {
        const fileName = 'index.txt'; 
        const filePath = path.join(__dirname, fileName);

        const initialContent = 'This is the initial content of the new file.\n';

        await fs.writeFile(filePath, initialContent, 'utf8');

        res.send(`File '${fileName}' created successfully.`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating the file.');
    }
});




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




// //io means entire circuit




// import express from "express";
// import connectDB from "./database/db.js"; // Import the MySQL connection module
// import cors from 'cors';
// import dotenv from "dotenv";
// import roles from './routes/role.route.js';
// import register from './routes/register.route.js';
// import login from './routes/login.route.js';
// import uploadRoute from './routes/upload.route.js';
// import { Server } from "socket.io";
// import { createServer } from "http";

// dotenv.config();
// const app = express();

// app.use(express.json());
// app.use(cors());

// const server = createServer(app);

// const io = new Server(server, {
//     cors: {
//         origin: "*",
//         methods: ["GET", "POST"],
//         credentials: true
//     }
// });

// let user = true;
// io.use((socket, next) => {
//     if (user) next();
// });

// io.on('connection', (socket) => {
//     console.log("User Connected", socket.id);

//     socket.on("message", ({ message, room }) => {
//         console.log(message, room);
//         io.to(room).emit('receive-message', message);
//     });

//     socket.on("disconnect", () => {
//         console.log("User Disconnected:", socket.id);
//     });
// });

// const PORT = process.env.PORT || 3000;

// // Connect to the MySQL database
// connectDB()
//     .then((connection) => {
//         console.log('Connected to MySQL database');
//         // You can use the connection object to interact with the database if needed
//     })
//     .catch((err) => {
//         console.error('Failed to connect to MySQL database', err);
//         process.exit(1); // Exit process with failure
//     });

// // Define routes
// app.use("/roles", roles);
// app.use("/user", register);
// app.use("/user", login);
// app.use("/upload", uploadRoute);

// // Simple route for health check
// app.get('/check', (req, res) => {
//     res.send('Project is On');
// });

// // Start the server
// server.listen(PORT, () => {
//     console.log(`Server is listening on port ${PORT}`);
// });

