import ApiError from "../utils/ApiError.js";

const validate=(schema)=>{
    return async(req,res,next)=>{
        try {
            const validatedData=await schema.parseAsync({
                body:req.body,
                params:req.body,
                query:req.query
            })
            req.validatedData=validatedData
            next()
        } catch (error) {
            next(
                new ApiError(400,"Validation failed",error.errors)
            )
        }
    }
}

export default validate