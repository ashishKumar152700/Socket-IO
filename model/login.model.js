import mongose from "mongoose";


const login=new mongose.Schema(
    {
        username:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        }
    }
)

const loginModel=mongose.model("login",login)       

export default loginModel;