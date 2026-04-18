import express from 'express'
import { deleteUser, test, updateUser } from '../controllers/user.controller.js';
import {verifyToken} from '../utils/verifyUser.js';


const userRouter=express.Router();

userRouter.get('/',test);
userRouter.patch('/update/:id',verifyToken,updateUser);
userRouter.delete('/delete/:id',verifyToken,deleteUser);

export default userRouter