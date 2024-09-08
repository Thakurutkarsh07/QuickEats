import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoutes.js"
import 'dotenv/config'
import userRouter from "./routes/userRoute.js"
import cartRouter from "./routes/cartRoute.js"

//app conig
const app = express()
const port = 3000

//middleware
app.use(express.json())
app.use(cors())

//DB COnnection
connectDB();

//api Endpoints
app.use("/api/user",userRouter)
app.use("/api/food",foodRouter)
app.use("/images",express.static('uploads'))
app.use("/api/cart",cartRouter)

app.get("/",(req,res)=>{
    res.send("API WORKING")
})

app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})
//mongodb+srv://quickeatsdb:dbquickeats@quickeats.qfuon.mongodb.net/?