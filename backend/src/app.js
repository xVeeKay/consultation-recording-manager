import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import errorHandler from "./middlewares/error.middleware.js"
import authRoutes from "./routes/auth.routes.js"
import customerRoutes from "./routes/customer.routes.js"
import consultationRoutes from "./routes/consultation.routes.js"
import dashboardRoutes from "./routes/dashboard.routes.js"


const app=express()
app.use(cors({
    origin:`${process.env.CORS_ORIGIN}`,
    credentials:true
}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.get("/health",(req,res)=>{
    res.status(200).json({
        message:"Server working perfectly"
    })
})
app.use("/api/v1/auth",authRoutes)
app.use("/api/v1/customers",customerRoutes)
app.use("/api/v1/consultations", consultationRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);




app.use(errorHandler)
export default app
