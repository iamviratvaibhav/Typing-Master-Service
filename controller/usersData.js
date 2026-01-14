import UserProgressData from "../models/userProgressData.js";
import mongoose from "mongoose";
import User from "../models/userModels.js";
import UserDataInsertion from "../models/userProgressData.js";

const insertUserProgressData = async (req, res) => {
  const { userName, testNum, timeTaken, accuracy, wpm, errors } = req.body;

  try {
    const userId = req.user.userId; //  FROM JWT
    const objectId = new mongoose.Types.ObjectId(userId);

    const user = await User.findById(objectId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await UserProgressData.create({
      userId: objectId,
      userName,
      testNum,
      timeTaken,
      accuracy,
      wpm,
      errors
    });

    return res.status(201).json({
      success: true,
      message: "User progress data inserted successfully"
    });

  } catch (error) {
    console.error("Insert error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const getUserProgressData = async (req, res) => {
  try {
    const userId = req.user.userId; //  FROM JWT
    const objectId = new mongoose.Types.ObjectId(userId);

    /* =========================
       1️ Last 15 Tests
    ========================== */
    const last15Accuracy = await UserProgressData.find(
      { userId: objectId },
      {
        _id: 0,
        testDate: 1,
        accuracy: 1,
        wpm: 1,
        errors: 1,
        timeTaken: 1
      }
    )
      .sort({ testDate: -1 })
      .limit(15);

      
    /* =========================
       2️ Best 5 Performances
    ========================== */
    const bestPerformances = await UserProgressData.find(
      { userId: objectId },
      {
        _id: 0,
        testDate: 1,
        accuracy: 1,
        wpm: 1,
        errors: 1,
        timeTaken: 1
      }
    )
      .sort({ accuracy: -1, errors: 1 })
      .limit(5);

    /* =========================
       3️ Summary
    ========================== */
    const summaryAgg = await UserProgressData.aggregate([
      { $match: { userId: objectId } },
      {
        $group: {
          _id: null,
          totalTests: { $sum: 1 },
          avgWPM: { $avg: "$wpm" },
          avgError: { $avg: "$errors" },
          avgAccuracy: { $avg: "$accuracy" }
        }
      }
    ]);

    const summary = summaryAgg.length
      ? {
        totalTests: summaryAgg[0].totalTests,
        avgWPM: Number(summaryAgg[0].avgWPM.toFixed(1)),
        avgError: Number(summaryAgg[0].avgError.toFixed(1)),
        avgAccuracy: Number(summaryAgg[0].avgAccuracy.toFixed(1))
      }
      : {
        totalTests: 0,
        avgWPM: 0,
        avgError: 0,
        avgAccuracy: 0
      };

    const activityDays = await UserProgressData.aggregate([
      {
        $match: { userId: objectId },
      }, {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$testDate" }
          }
        }

      }, {
        $sort: { _id: -1 }
      }
    ])
   

    return res.status(200).json({
      success: true,
      last15Accuracy,
      bestPerformances,
      summary,
      activityDays
    });

  } catch (error) {
    console.error("Fetch error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


export { insertUserProgressData, getUserProgressData };