// import express from "express"
// import cors from "cors"
// import { connectDB } from "./config/db.js"
// import foodRouter from "./routes/foodRoutes.js"
// import 'dotenv/config'
// import userRouter from "./routes/userRoute.js"
// import cartRouter from "./routes/cartRoute.js"
// import orderRouter from "./routes/orderRoute.js"

// //app conig
// const app = express()
// const port = 3000

// //middleware
// app.use(express.json())
// app.use(cors())

// //DB COnnection
// connectDB();

// //api Endpoints
// app.use("/api/user",userRouter)
// app.use("/api/food",foodRouter)
// app.use("/images",express.static('uploads'))
// app.use("/api/cart",cartRouter)
// app.use("/api/order",orderRouter)

// app.get("/",(req,res)=>{
//     res.send("API WORKING")
// })

// app.listen(port,()=>{
//     console.log(`server is running on port ${port}`)
// })

import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoutes.js";
import 'dotenv/config';
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

import paymentRoutes from "./routes/paymentRoutes.js";
// App configuration
const app = express();
const port = 3000; // Port is directly in the code

// Middleware
app.use(express.json());
app.use(cors());

// DB Connection
connectDB(); // MongoDB URL is handled in the db.js file, not in the .env file

// API Endpoints
app.use("/api/user", userRouter);
app.use("/api/food", foodRouter);
app.use("/images", express.static('uploads'));
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use(paymentRoutes);
app.get("/", (req, res) => {
    res.send("API WORKING");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
