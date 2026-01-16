import jwt from "jsonwebtoken";

const authentication = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // { userId }
    next();
  } catch (error) {
    console.error("JWT error:", error.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default authentication;
