import { Customer } from "../models/Customer.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";


export const createCustomer=asyncHandler(async(req,res)=>{
    const {name,phone,email,birthDate,notes}=req.validatedData.body
    const customer=await Customer.create({
        astrologerId:req.user._id,
        name,
        phone,
        email,
        birthDate,
        notes
    })
    return res.status(200).json(
        new ApiResponse(200,customer,"Customer created successfully")
    )
})

export const getAllCustomers=asyncHandler(async(req,res)=>{
    const customers=await Customer.find({astrologerId:req.user._id}).sort({createdAt:-1})
    return res.status(200).json(
        new ApiResponse(200,customers,"Customers fetched successfully")
    )
})

export const getCustomerById=asyncHandler(async(req,res)=>{
    const customer=await Customer.findOne({
        _id:req.params.id,
        astrologerId:req.user._id
    })
    if(!customer){
        throw new ApiError(404,"Customer not found")
    }
    return res.status(200).json(
        new ApiResponse(200,customer,"Customer fetched successfully")
    )
})

export const updateCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findOneAndUpdate(
    {
      _id: req.params.id,

      astrologerId: req.user._id,
    },

    req.validatedData.body,

    {
      new: true,
    },
  );

  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, customer, "Customer updated successfully"));
})

export const deleteCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findOneAndDelete({
    _id: req.params.id,

    astrologerId: req.user._id,
  });

  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Customer deleted successfully"));
})
