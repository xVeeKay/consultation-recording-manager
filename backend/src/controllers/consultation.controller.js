import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Consultation } from "../models/Consultation.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Customer } from "../models/Customer.model.js";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs"


export const createConsultation=asyncHandler(async(req,res)=>{
    const {customerId,title,notes,consultationDate,duration,tags}=req.validatedData.body
    const customer=await Customer.findOne({
        _id:customerId,
        astrologerId:req.user._id
    })
    if(!customer){
        throw new ApiError(404,"Customer not found")
    }
    const consultation=await Consultation.create({
        astrologerId:req.user._id,
        customerId,
        title,
        consultationDate,
        duration,
        tags
    })
    return res
      .status(200)
      .json(new ApiResponse(200, consultation, "Consultation created successfully"));
})

export const getConsultations=asyncHandler(async(req,res)=>{
    const consultations=await Consultation.find({astrologerId:req.user._is}).populate("customerId","name phone").sort({createdAt:-1})
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          consultations,
          "Consultations fetched successfully",
        ),
      )
})

export const getConsultationById = asyncHandler(async (req, res) => {
  const consultation = await Consultation.findOne({
    _id: req.params.id,
    astrologerId: req.user._id,
  }).populate("customerId", "name phone");

  if (!consultation) {
    throw new ApiError(404, "Consultation not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, consultation, "Consultation fetched successfully"),
    )
})

export const deleteConsultation = asyncHandler(async (req, res) => {
  const consultation = await Consultation.findOne({
    _id: req.params.id,
    astrologerId: req.user._id,
  });

  if (!consultation) {
    throw new ApiError(404, "Consultation not found")
  }

  if (consultation.recordingPublicId) {
    await cloudinary.uploader.destroy(consultation.recordingPublicId, {
      resource_type: "video",
    })
  }

  await consultation.deleteOne()

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Consultation deleted successfully"))
})

export const uploadRecording=asyncHandler(async(req,res)=>{
    const consultation = await Consultation.findOne({
      _id: req.params.id,
      astrologerId: req.user._id,
    });

    if (!consultation) {
      throw new ApiError(404, "Consultation not found");
    }

    if (!req.file) {
      throw new ApiError(400, "Recording file required");
    }

    const result=await cloudinary.uploader.upload(req.file.buffer,{
        resource_type:"video",
        folder:"consulation-recordings"
    })
    fs.unlinkSync(req.file.path)
    consultation.recordingUrl=result.secure_url
    consultation.recordingPublicId=result.public_id
    await consultation.save()
    return res.status(200).json(
        new ApiResponse(200,consultation,"Recording uploaded successfully")
    )
})
