import jwt from 'jsonwebtoken';
import registerModel from '../model/register.model.js';

export const verifyJWT = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    
    if (!token) {
      return res.status(401).send("Unauthorized request: Token missing");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await registerModel.findById(decodedToken.userId).select("-password");

    if (!user) {
      return res.status(401).send("Unauthorized request: User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).send("Unauthorized request: Invalid token");
    } else {
      console.error("Token verification error:", error.message);
      return res.status(500).send("Internal Server Error");
    }
  }
};
