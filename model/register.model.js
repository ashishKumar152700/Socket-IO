import mongoose from "mongoose"



const register=new mongoose.Schema(
    {
        username:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        lastName:{
            type:String,
            required:true
        },
        firstName:{
            type:String,
            required:true
        },
        state: {
            type:String,
            required:true
        },
        roles:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'rolesModel',
            required:true
        }]
    }
)

const registerModel=mongoose.model("register",register)

export default registerModel;