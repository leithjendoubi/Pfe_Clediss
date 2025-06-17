import express from "express";
import {
  isAuthenticated,
  login,
  logout,
  register,
  resetPassword,
  sendResetOtp,
  sendVerifyOtp,
  verifyEmail,
  addPhoto,
  loginAdmin,
} from "../controllers/authController.js";
import userAuth from "../middleware/userAuth.js";
import upload from "../middleware/multer.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post('/admin/login', loginAdmin);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/send-verify-otp", userAuth, sendVerifyOtp);
authRouter.post("/verify-account", userAuth, verifyEmail);
authRouter.get("/is-auth", userAuth, isAuthenticated);
authRouter.post("/send-reset-otp", sendResetOtp);
authRouter.post("/reset-password", resetPassword);
authRouter.post('/:userId/photo', upload.single('photo'), addPhoto);

export default authRouter;
