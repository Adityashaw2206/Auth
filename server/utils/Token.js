import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


export const generateAccessToken = (payload) => {
    return jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY,
    })
}

export const generateRefreshToken = (payload) => {
    return jwt.sign(payload,process.env.REFRESH_TOKEN_SECRET,{
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY,
    })
}