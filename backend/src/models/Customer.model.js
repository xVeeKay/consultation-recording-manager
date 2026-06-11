import mongoose from "mongoose";

const customerSchema=new mongoose.Schema({
    astrologerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        index:true
    },
    name:{
        type:String,
        required:true,
        trim:true,
    },
    phone:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        trim:true,
        lowercase:true,
        default:null
    },
    birthDate:{
        type:String,
        default:null
    },
    notes:{
        type:String,
        default:""
    }
},{timestamps:true})

export const Customer=new mongoose.model("Customer",customerSchema)