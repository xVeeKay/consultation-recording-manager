import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


const app=express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
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

export default app
