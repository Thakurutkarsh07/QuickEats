// // import orderModel from "../models/orderModel.js"
// import orderModel from "../models/orderModel.js"
// import userModel from "../models/userModel.js"
// // import Stripe from "stripe"
// import Razorpay from "razorpay"


// // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
// const razorpay = new Razorpay(process.env.RAZORPAY_SECRET_KEY)



// //placing user order for frontend
// const placeOrder = async(req,res)=>{
//     const frontend_url = "http://localhost:5173";
//     try{
//         const newOrder = new orderModel({
//             userId:req.body.userId,
//             items:req.body.items,
//             amount:req.body.amount,
//             address:req.body.address
//         })

//         await newOrder.save();
//         await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}});

//         const line_items = req.body.items.map((item)=>({
//             price_data:{
//                 currency:"inr",
//                 product_data:{
//                     name:item.name
//                 },
//                 unit_amount:item.price*100*80
//             },
//             quantity:item.quantity
//         }))
//         line_items.push({
//             price_data:{
//                 currency:"inr",
//                 product_data:{
//                     name:"Delivery Charges"
//                 },
//                 unit_amount:2*100*80
//             },
//             quantity:1
//         })
//         const session = await stripe.checkout.sessions.create({
//             line_items:line_items,
//             mode:'payment',
//             success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
//             cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`
//         })

//         res.json({success:true,session_url:session.url})
//     } catch(error) {
//         console.log(error);
//         res.json({success:false,message:"Error"})
//     }
// }
 
// export {placeOrder}

import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Razorpay from "razorpay";
import 'dotenv/config';

// Initialize Razorpay with key_id and key_secret
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET
});

export const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5173";

  try {
    // Create new order in your database
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    // Calculate the amount in paise (Razorpay uses INR in paise)
    const amountInPaise = req.body.amount * 100;

    // Create Razorpay order
    const options = {
      amount: amountInPaise, // amount in paise
      currency: "INR",
      receipt: newOrder._id.toString() // unique receipt ID
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Send response back to frontend with necessary details
    res.json({
      success: true,
      order_id: razorpayOrder.id, // Razorpay order ID
      amount: amountInPaise,
      currency: "INR",
      key_id: process.env.RAZORPAY_KEY_ID, // Razorpay key_id for frontend use
      orderId: newOrder._id // your internal order ID
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Order placement failed" });
  }
};
