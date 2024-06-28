import mongoose from "mongoose";


const connectDB=async(DATABASE_URL)=>{

    try {
        
        const DB_Option={
            dbname: "Application",
            
        }

       await mongoose.connect(DATABASE_URL,DB_Option);
        console.log("DataBase Connected")
        
    } catch (error) {
     
        console.log(error)
        console.log("Database Connection Issue")
    }
}


export default connectDB;



// import mysql from 'mysql2/promise.js';
// import dotenv from 'dotenv';

// dotenv.config();

// const connectDB = async () => {
//     try {
//         const connection = await mysql.createConnection({
//             host: process.env.MYSQL_HOST,
//             user: process.env.MYSQL_USER,
//             password: process.env.MYSQL_PASSWORD,
//             database: process.env.MYSQL_DB
//         });

//         console.log('MySQL Database Connected');
//         return connection;
//     } catch (error) {
//         console.error('MySQL Database Connection Issue:', error);
//         process.exit(1); // Exit process with failure
//     }
// };

// export default connectDB;
