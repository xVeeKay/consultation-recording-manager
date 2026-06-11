import dotenv from "dotenv"
import app from "./app.js"
import connectDB from "./database/dbConnection.js"

dotenv.config()

const PORT=process.env.PORT || 8000

const startServer=async()=>{
    await connectDB()
    app.listen(PORT,()=>{
        console.log(`Server started on port: ${PORT}`)
    })
}

startServer()