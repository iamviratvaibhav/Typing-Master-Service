import express from 'express'
import googleLogin from '../controller/googlelogin.js'
import updateUserProfile from '../controller/userProfile.js'
import {signupPage, loginpage, logout} from '../controller/userController.js'

const router=express.Router();
router.post('/signup', signupPage);
router.post('/login', loginpage);
router.post('/logout', logout);


router.post('/google-signup-login', googleLogin);


export default router