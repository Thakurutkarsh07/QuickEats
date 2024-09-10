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
            address: req.body.address,
            payment: req.body.payment
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
            ord_id:newOrder._id,
            order_id: razorpayOrder.id,
            amount: totalAmount,
            key_id: process.env.RAZORPAY_KEY_ID,
            product_name: req.body.items.map(item => item.name).join(", "),
            description: 'Order payment for products',
            name: "Utkarsh Thakur",
            email: "utkarsh@gmail.com",
            contact: "8567345632",
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error placing the order" });
    }
}; 


//verify
import crypto from 'crypto'; // Import the crypto module

const verifyOrder = async (req, res) => {
    try {
		const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id  } =
			req.body;
		const sign = razorpay_order_id + "|" + razorpay_payment_id;
		const expectedSign = crypto
			.createHmac("sha256", process.env.RAZORPAY_SECRET)
			.update(sign.toString())
			.digest("hex");

		if (razorpay_signature === expectedSign) {            
			return res.status(200).json({success:true, message: "Payment verified successfully" });
		} else {
			return res.status(400).json({success:false, message: "Invalid signature sent!" });
		}
	} catch (error) {
		res.status(500).json({ success:false ,message: "Internal Server Error!" });
		console.log(error);
	}

};

const verifiedOrder = async (req, res) => {
    try {
        const { order_id } = req.body; // Extract the order_id from the request body
        
        // Update the order in the database to set payment to true
        await orderModel.findByIdAndUpdate(order_id, { payment: true });
        
        res.status(200).json({ success: true, message: "Order updated successfully" });
    } catch (err) {
        console.error("Error updating order:", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

//usersOrders for frontend
const usersOrders = async (req, res) => {
try{
    const orders = await orderModel.find({userId:req.body.userId})
    res.json({success:true,data:orders})
}catch(err){
    console.error(err);
    
    res.status(500).json({success:false,message:"Internal Server Error"})
}

}
//Listing orders for admin panel
const listOrder = async(req,res)=>{
    try{
        const orders = await orderModel.find({})
        res.json({success:true,data:orders})
}catch(err){
    res.json({success:false,message:"error"})
}
}

//Updating status
const updateStatus = async (req, res) => {
    try {
         await orderModel.findByIdAndUpdate(req.body.orderId, { status:req.body.status });
        res.json({ success: true,message:"Status Updated" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: "Internal Server Error" });
            }
            };

export { placeOrder,verifyOrder,verifiedOrder ,usersOrders,listOrder, updateStatus};
