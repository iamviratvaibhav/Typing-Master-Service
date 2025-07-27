import mongoose from 'mongoose';

const oauthAccountSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to your existing User model
    required: true
  },
  provider: {
    type: String,
    enum: ['google', 'github'], // Add others like 'facebook', etc.
    required: true
  },
  providerAccountId: {
    type: String,
    required: true,
    unique: true // Ensures no duplicate Google/GitHub IDs
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const OAuthAccount = mongoose.model('OAuthAccount', oauthAccountSchema);
export default OAuthAccount;
