import rolesModel from "../model/roles.model.js";

const addRole=async(req,res)=>{

    const {roles} = req.body;

    try {

        const existingRole= await rolesModel.findOne({
            roles
        })

        if(existingRole){
            return res.status(400).json({message: "Role Already Exist"})
        }
        const roleData= await rolesModel.create({
            roles
        })
        return res.status(200).json({roleData})
        
    } catch (error) {
        
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}


export {addRole}