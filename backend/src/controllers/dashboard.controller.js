import { Customer } from "../models/Customer.model.js";
import { User } from "../models/User.model.js";
import { Consultation } from "../models/Consultation.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getDashboardStats=asyncHandler(async(req,res)=>{
    const totalCustomers=await Customer.countDocuments({astrologerId:req.user._id})
    const totalConsultations=await Consultation.countDocuments({astrologerId:req.user._id})
    const totalRecordings=await Consultation.countDocuments({astrologerId:req.user._id,recordingUrl:{$ne:null}})
    const recentConsultations=await Consultation.find({astrologerId:req.user._id}).populate("customerId","name").sort({createdAt:-1}).limit(5)

    return res.status(200).json(
        new ApiResponse(200,{totalCustomers,totalConsultations,totalRecordings,recentConsultations},"Dashboard loaded")
    )
})