import jwt from "jsonwebtoken";

const createTokenAndSaveCookie = (userId, res) => {
  const token = jwt.sign(
    { userId },
    process.env.JWT_SECRET, //  SAME SECRET
    { expiresIn: "3d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 3 * 24 * 60 * 60 * 1000,
  });

  return token;
};

export default createTokenAndSaveCookie;
