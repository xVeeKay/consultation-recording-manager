import { User } from "../models/User.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import asyncHandler from "../utils/asyncHandler.js";


const cookieOptions={
    httpOnly:true,
    sameSite:"lax"
}


export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.validatedData.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }
  const user = await User.create({
    name,
    email,
    password,
  });
  const createdUser = await User.findById(user._id).select("-password");
  res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.validatedData.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid Credentials");
  }
  const token=jwt.sign({_id:user._id,email:user.email},process.env.JWT_SECRET,{expiresIn:"1d"})
  const loggedInUser=await User.findById(user._id).select("-password")
  return res.status(200).cookie("token",token,cookieOptions).json(
    new ApiResponse(200,{user:loggedInUser,token},"Login Successfull")
  )
});

export const logoutUser=asyncHandler(async(req,res)=>{
    return res.status(200).clearCookie("token",cookieOptions).json(
        new ApiResponse(200,{},"Logout Successfull")
    )
})

export const getCurrentUser=asyncHandler(async(req,res)=>{
  return res.status(200).json(
    new ApiResponse(200,req.user,"Current User Fetched")
  )
})
