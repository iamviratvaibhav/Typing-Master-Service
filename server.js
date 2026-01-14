import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Google, generateState, generateCodeVerifier } from "arctic";
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./models/userModels.js"; // Make sure this path is correct
import createTokenAndSaveCookie from "./JWT/generateToken.js"; // Optional for auth
import router from "./routes/route.js";
import connectCloudinary from "./config/cloudinary.js";
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // your frontend port
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api', router)
app.use((req, res, next) => {
  console.log("➡️", req.method, req.originalUrl);
  next();
});

connectCloudinary(); 
//Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// Setup Arctic Google OAuth
const google = new Google(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// Step 1: Redirect to Google
app.get("/auth/google", async (req, res) => {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const scopes = ["openid", "profile", "email"];

  const url = await google.createAuthorizationURL(state, codeVerifier, scopes);

  res.cookie("state", state, {
    httpOnly: true,
    secure: false,
    maxAge: 600000,
    path: "/"
  });

  res.cookie("code_verifier", codeVerifier, {
    httpOnly: true,
    secure: false,
    maxAge: 600000,
    path: "/"
  });

  res.redirect(url);
});

// Step 2: Handle Google Callback (if using OAuth redirect)
app.get("/auth/google/callback", async (req, res) => {
  const { state, code } = req.query;

  const savedState = req.cookies.state;
  const codeVerifier = req.cookies.code_verifier;

  if (state !== savedState) {
    return res.status(400).send("Invalid state");
  }

  const tokens = await google.validateAuthorizationCode(code, codeVerifier);
  const user = await google.getUser(tokens.accessToken);

  res.send(`Logged in as: ${user.name} (${user.email})`);
});

// REST API for Google Login from frontend JWT (POST /typing-master/google-signup-login)
app.post("/api/google-signup-login", async (req, res) => {
  const { email, name } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        password: "google-auth", // placeholder, not used
      });
      await user.save();
    }

    // Optional: generate JWT and store in cookie
    createTokenAndSaveCookie(user._id, res);

    res.status(200).json({
      message: "Google login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      }
    });
  } catch (error) {
    console.error("Google Login Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//  Start Server
app.listen(5000, () => {
  console.log(" Server running on http://localhost:5000");
});
