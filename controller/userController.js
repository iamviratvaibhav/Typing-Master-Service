

import User from "../models/userModels.js";
import bcrypt from "bcryptjs";

import { v2 as cloudinary } from "cloudinary";

import createTokenAndSaveCookie from "../JWT/generateToken.js";
import UserProfileModel from "../Database/userSchemaProfile.js";
import jwt from "jsonwebtoken";
const secretKey = process.env.SECRET_KEY || "RadhaSoamiji";


const loginpage = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("Invalid credentials");
      return res.status(400).json({ message: "Invalid credentials" });
    }
    if (user.authProvider === 'google') {
      console.log("Do login with google")
      return res.status(401).json({ message: "Do Login with google" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Invalid credentials password");
      return res.status(400).json({ message: "Invalid credentials" });
    }


    // SINGLE TOKEN CREATION
    createTokenAndSaveCookie(user._id, res);
    // createTokenAndSaveCookie(user._id, res);
    const token = jwt.sign({ userId: user._id, email: user.email }, secretKey, {
      expiresIn: '3d',
    })
    // console.log("token", token);
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};


// const loginpage = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     if (user.authProvider === 'google') {
//       return res.status(401).json({ message: "Do Login with Google" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     // ✅ Create token ONCE (you were calling it twice ❌)
//     createTokenAndSaveCookie(user._id, res);

//     // ✅ 3-second delay
//     await new Promise(resolve => setTimeout(resolve, 3000));

//     return res.status(200).json({
//       success: true,
//       message: "Login successful",
//       user: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//       },
//     });

//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };


const logout = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "none",
      secure: true
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful"
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const signupPage = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  try {
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    if (newUser) {
      createTokenAndSaveCookie(newUser._id, res); // optional if using JWT
      return res.status(201).json({
        message: 'User registered successfully',
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
      });
    }

  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};


const getUserEmailAndName = async (req, res) => {
  const id = req.params.id;
  try {
    if (!id) {
      console.log("User id not found");
      return res.status(404).json({ message: "User not found" });
    }

    const user = await User.findById(id);
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User found",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error(error);
    console.log("Error finding user");
    return res.status(500).json({ message: "Internal server error" });
  }
};



const userProfile = async (req, res) => {
  try {
    const { profession, about } = req.body;

    if (!profession || !about || !req.file) {
      return res.status(400).json({ message: "All fields required" });
    }

    // Convert buffer to base64
    const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    // Upload to cloudinary
    const uploadResult = await cloudinary.uploader.upload(fileStr, {
      folder: "profile_images",
    });

    // Save only URL
    const profileImage = uploadResult.secure_url;

    // Save to DB
    await UserProfileModel.create({
      userId: req.user.userId,
      profession,
      about,
      profileImage,
    });

    return res.status(200).json({
      message: "Profile updated",
      profileImage,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getUserProfile = async (req, res) => {
  const userId = req.params.id;
  try {

    const profile = await UserProfileModel
      .findOne({ userId })
      .sort({ createdAt: -1 });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({
      profile
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



export { loginpage, logout, signupPage, getUserEmailAndName, userProfile, getUserProfile };
