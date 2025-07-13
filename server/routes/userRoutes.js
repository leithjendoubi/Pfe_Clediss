import express from "express";
import userAuth from "../middleware/userAuth.js";
import { getUserData , getUserDatapara } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/data", userAuth, getUserData);
userRouter.post("/userdata", userAuth, getUserData);

userRouter.get("/userdata/:userId", getUserDatapara);

export default userRouter;
