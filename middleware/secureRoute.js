import jwt from 'jsonwebtoken';
import User from '../models/userModels.js';

const secureRoute=async (req, res, next)=>{
    try {
        const token=req.cookies.jwt;
        if(!token){
            return res.status(401).json({message:"Unauthorized"});
        }
        const decodedToken=jwt.verify(token, process.env.JWT_TOKEN);
        if(!decodedToken){
            return res.status(402).json({message: "Not varifed token"});
        }
        // const user= await User.findById(decodedToken.userId).select("email");
        const user= await User.findById(decodedToken.userId).select("-password");
        if(!user){
            return res.status(403).json({message:"Unauthorized"});
        }

        req.user=user;
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}

export default secureRoute;