import jwt from 'jsonwebtoken';
const authentication = (req, res, next)=>{
    const token=req.cookies.jwt;;
    if(!token){
        return res.status(401).json({messsage:"Unauthorized"});
    }
    try {
        req.user=jwt.verify(token, process.env.JWT_TOKEN);
         res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
        next();
    } catch (error) {
        console.log("error", error);
        return res.status(403).json({messsage:"Forbidden"});
    }
};
export default authentication;