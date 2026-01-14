import express from 'express'
import googleLogin from '../controller/googlelogin.js'
import {signupPage, loginpage, logout, getUserEmailAndName, userProfile, getUserProfile} from '../controller/userController.js'
import authentication from '../middleware/middleware.js'
import {insertUserProgressData, getUserProgressData} from '../controller/usersData.js'
import upload from '../middleware/multerConfig.js'
const router=express.Router();
router.post('/signup', signupPage);
router.post('/login', loginpage);
router.post('/logout', logout);
router.get('/get-userEmail/:id', getUserEmailAndName);
router.post('/insertingData',authentication, insertUserProgressData);
router.get('/getUserProgressData/:id',authentication, getUserProgressData);
router.get('/getUserProfile/:id',authentication, getUserProfile);
router.post("/userProfile",authentication, upload.single("profileImage") ,userProfile);
router.post('/google-signup-login',  googleLogin);


export default router