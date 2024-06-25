import bcrypt from 'bcrypt';
import registerModel from '../model/register.model.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import rolesModel from '../model/roles.model.js';

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await registerModel.findOne({ username });

        if (!user) {
            return res.status(404).send('User not found');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).send('Invalid password');
        }

        const rolesID = user.roles.map(role => new mongoose.Types.ObjectId(role));
        const rolesDoc = await rolesModel.find({ _id: { $in: rolesID } });
        const roleNames = rolesDoc.map(role => role.roles);

        console.log(roleNames);

        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        const refreshToken = jwt.sign(
            { userId: user._id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        const resUser = user.toObject();
        delete resUser.password;
        resUser.roles = roleNames;

        res.cookie("accessToken", accessToken, { httpOnly: true, maxAge: 86400 }); // 1 day

        return res.status(200).send({ accessToken, refreshToken, roleNames });

    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).send('Internal Server Error');
    }
};

export default login;
