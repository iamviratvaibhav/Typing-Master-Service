
// controller/googleLogin.js
import User from "../models/userModels.js";
import OAuthAccount from "../models/OAuthAccount.js";
import createTokenAndSaveCookie from "../JWT/generateToken.js";

const googleLogin = async (req, res) => {
  const { email, name, sub: googleId } = req.body;
  const provider = "google";
  const providerAccountId = googleId;

  try {
    // 1️ Check OAuth account
    let oauthAccount = await OAuthAccount
      .findOne({ provider, providerAccountId })
      .populate("user");

    if (oauthAccount) {
      createTokenAndSaveCookie(oauthAccount.user._id, res);
      return res.status(200).json({
        message: "Google login successful",
        user: oauthAccount.user,
      });
    }

    // 2️ Check existing user by email
    let user = await User.findOne({ email });

    if (!user) {
      // 3️ Create new user
      user = await User.create({
        name,
        email,
        // password: "google-auth", // placeholder
        password: null,
        authProvider: "google",   // recommended
      });
    }

    // 4️ Create OAuthAccount link
    await OAuthAccount.create({
      user: user._id,
      provider,
      providerAccountId,
    });

    createTokenAndSaveCookie(user._id, res);

    return res.status(201).json({
      message: "Google login successful",
      user,
    });

  } catch (error) {
    console.error("Google OAuth login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



export default googleLogin;
