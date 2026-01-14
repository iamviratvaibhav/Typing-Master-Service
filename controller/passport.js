import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from './models/userModels.js';
import dotenv from 'dotenv';
dotenv.config();

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,       
    clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
  
    callbackURL: process.env.REDIRECT_URI,
  },
  async (accessToken, refreshToken, profile, done) => {
    // Check if user exists in DB or create one
    const existingUser = await User.findOne({ googleId: profile.id });

    if (existingUser) return done(null, existingUser);

    const newUser = new User({
      name: profile.displayName,
      email: profile.emails[0].value,
      googleId: profile.id,
    });

    await newUser.save();
    done(null, newUser);
  }
));
