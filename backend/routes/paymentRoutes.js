import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// Route to create an order
router.post('/api/order/place', async (req, res) => {
  try {
    const { address, items, amount } = req.body;

    // Create an order in Razorpay
    const options = {
      amount: amount * 100, // amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    if (order) {
      res.json({
        success: true,
        order_id: order.id,
        amount: order.amount,
        key_id: process.env.RAZORPAY_KEY_ID,
      });
    } else {
      res.status(400).json({ success: false, message: 'Failed to create order' });
    }
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

export default router;
