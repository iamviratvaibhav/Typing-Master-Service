import mongoose from "mongoose";

const userDataInsertionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  testNum: {
    type: Number,
    required: true,
  },
  timeTaken: {
    type: Number,
    required: true,
  },
  accuracy: {
    type: Number,
    required: true,
  },
   errors: {
    type: Number,
    default: 0 // you said you’ll store it further
  },
  wpm: {
    type: Number,
    required: true,
  },
  testDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const UserDataInsertion = mongoose.model(
  "UserProgressData",
  userDataInsertionSchema
);

export default UserDataInsertion;
