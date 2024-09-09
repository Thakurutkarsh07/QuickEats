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

// Initialize Razorpay instance
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET
});

// Placing user order for frontend
const placeOrder = async (req, res) => {
    const frontend_url = "http://localhost:5173";
    
    try {
        // Create a new order in the database
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        });

        // Save the new order to the database
        await newOrder.save();

        // Clear the user's cart after placing the order
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        // Calculate total order amount (in paise for Razorpay, so multiplying by 100)
        const totalAmount = req.body.amount * 100; // Razorpay expects the amount in the smallest currency unit (paise)

        // Create options for Razorpay order
        const options = {
            amount: totalAmount,
            currency: 'INR',
            receipt: `order_rcptid_${newOrder._id}`,
            payment_capture: 1 // Automatically capture the payment
        };

        // Create a Razorpay order
        const razorpayOrder = await razorpayInstance.orders.create(options);

        // Send response with necessary details for Razorpay checkout
        res.status(200).json({
            success: true,
            msg: 'Order Created',
            order_id: razorpayOrder.id,
            amount: totalAmount,
            key_id: process.env.RAZORPAY_KEY_ID,
            product_name: req.body.items.map(item => item.name).join(", "),
            description: 'Order payment for products',
            name: "Sandeep Sharma",
            email: "sandeep@gmail.com",
            contact: "8567345632",
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error placing the order" });
    }
};

export { placeOrder };
