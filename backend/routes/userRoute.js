import express from "express";
import { loginUser, registerUser } from "../controllers/userController.js";
import { validateUserRegistration, validateUserLogin } from "../middleware/validation.js";

const userRouter = express.Router();

userRouter.post("/register", validateUserRegistration, registerUser);
userRouter.post("/login", validateUserLogin, loginUser);

export default userRouter;