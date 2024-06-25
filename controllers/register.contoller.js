import registerModel from "../model/register.model.js";
import bcrypt from 'bcrypt';
import rolesModel from "../model/roles.model.js";


const register = async (req, res) => {
    try {
        const { username, email, password ,roles,lastName,firstName,state} = req.body;
        if (!username || !email || !password || !roles || !Array.isArray(roles) || roles.length === 0) {
            return res.status(400).json({ message: "All Fields is required" });
        }

        const existingUser=await registerModel.findOne({username});

        if(existingUser){
           return  res.status(403).send('Username Should Be Unique')
        }

        const rolesDoc= await rolesModel.find({ roles : {$in: roles} })


        if (rolesDoc.length !== roles.length){
            return res.status(400).json({ message: "One or more roles are invalid" });
        }
        
        const rolesID=rolesDoc.map(roles=>roles._id)
        
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await registerModel.create({
            username,
            email,  
            state,
            lastName,
            firstName,
            password:hashedPassword,
            roles: rolesID
        });
        res.status(200).send('User created successfully');
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(400).send('Error in creating the user');
    }
};


const getUsers=async(req,res)=>{

    try {
        const allUsers = await registerModel.find().populate('roles', 'roles').lean()

        
        allUsers.forEach(user=>{
            delete user._id;
            delete user.password
            delete user.roles
            // user.roles.forEach(role=>{
                //     delete role._id
                // })
            })
            
            console.log(allUsers)
        

        res.status(200).json(allUsers);

    } catch (error) {
        console.log('error in getUsers')
    }
}



const deleteUser = async (req, res) => {
    try {
      const deletedUser = await registerModel.findByIdAndDelete(req.params.id);
  
      if (!deletedUser) {
      
        return res.status(404).json({ error: "User not found" });
      }
  
      console.log(deletedUser);
      res.status(200).json("User Deleted");
    } catch (error) {
      res.status(400).json({ error: "Error in deleting the user" });
    }
  
  




}



export  {register,getUsers,deleteUser};
