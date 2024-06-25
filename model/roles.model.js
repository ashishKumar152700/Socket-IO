import mongoose from "mongoose";

const rolesSchema=new mongoose.Schema({
    roles:{
        type:String,
    },

});

const rolesModel=mongoose.model('rolesModel',rolesSchema);

export default rolesModel;