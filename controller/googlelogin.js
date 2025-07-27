
// controller/googleLogin.js
import User from "../models/userModels.js";
import OAuthAccount from "../models/OAuthAccount.js";
import createTokenAndSaveCookie from "../JWT/generateToken.js";

const googleLogin = async (req, res) => {
  const { email, name, sub: googleId } = req.body; // `sub` = Google user ID
  const provider = "google";
  const providerAccountId = googleId;

  try {
    const oauthAccount = await OAuthAccount.findOne({ provider, providerAccountId }).populate("user");

    if (!oauthAccount) {
      // Create new user and link to OAuth account
      const newUser = new User({
        name,
        email,
        password: "google-auth"
      });
      await newUser.save();

      const newOAuthAccount = new OAuthAccount({
        user: newUser._id,
        provider,
        providerAccountId
      });
      await newOAuthAccount.save();

      createTokenAndSaveCookie(newUser._id, res);

      return res.status(201).json({
        message: "New Google user created and logged in",
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        }
      });
    }

    // User exists – log in
    const existingUser = oauthAccount.user;
    createTokenAndSaveCookie(existingUser._id, res);

    return res.status(200).json({
      message: "Google login successful",
      user: {
        _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
      }
    });
  } catch (error) {
    console.error("Google OAuth login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default googleLogin;
