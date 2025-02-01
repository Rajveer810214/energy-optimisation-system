import { Router } from "express";
import { loginUser, userRegister,logOutUser,getUserDetails,refreshAccessToken } from "../controllers/user.controller.js";
import verifyJWT from "../middleware/Auth.middleware.js";
import { resetPassword, verificationCode, verifyEmail } from "../controllers/verify.controllers.js";
const router=Router()

router.route('/')
router.route('/register').post(userRegister)
router.route('/login').post(loginUser)
router.route('/refresh-Token').post(refreshAccessToken)
router.route('/send-verification-code').post(verificationCode)
router.route('/verify-email').post(verifyEmail)
router.route('/logOut').post(verifyJWT(['user', 'admin']),logOutUser)
router.route('/verify-code').post(verifyEmail)
router.route('/current-user-details').get(verifyJWT(['admin', 'user']),getUserDetails)

export default router