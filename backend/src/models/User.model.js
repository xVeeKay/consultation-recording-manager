import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true
    }
},{timestamps:true})

userSchema.pre("save",async function(){
    if(!this.isModified("password")){
        return next()
    }
    this.password=await bcrypt.hash(this.password,10)
})

userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password)
}

export const User=mongoose.model("User",userSchema)