import express from "express";
import { signUp,login, googleAuth,logout,refreshToken} from "../controllers/auth.controller.js";

const authRouter=express.Router();

authRouter.post('/signup',signUp);
authRouter.post('/login',login);
authRouter.post('/google',googleAuth);
authRouter.post('/logout',logout);
authRouter.get('/refreshtoken', refreshToken);
export default authRouter;