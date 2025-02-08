import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app=express()

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
// app.use(express.static("public"))
app.use(cookieParser())


import userRouter from './routes/router.js'
import adminRouter from './routes/admin.router.js'
// import errorHandler from "./utils/errorHandler.js"
app.use('/api/users',userRouter)
app.use('/api/admin',adminRouter)
// app.use(errorHandler); 
export {app}