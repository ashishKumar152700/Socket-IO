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