import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError';

export const authUser = (req,res,next) => {
    const {token}  = req.headers;
    if(!token){
        throw new ApiError(401,"Unauthorized access !! No token provided");
    }
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.userId = decoded._id;
        next();
    } catch (error) {
        console.log(error);
        throw new ApiError(401,error.message);
    }
}