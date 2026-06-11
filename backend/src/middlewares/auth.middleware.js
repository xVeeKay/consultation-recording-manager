import jwt from "jsonwebtoken"
import {User} from "../models/User.model.js"
import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"

const verifyJWT=asyncHandler(async(req,res,next)=>{
    const token=req.cookies?.token
    if(!token){
        throw new ApiError(401,"Unauthorized request")
    }
    const decodedToken=jwt.verify(token,process.env.JWT_SECRET)
    const user=await User.findById(decodedToken._id).select("-password")
    if(!user){
        throw new ApiError(401,"Invalid token")
    }
    req.user=user
    next()
})
export default verifyJWT