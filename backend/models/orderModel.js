import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'User ID is required']
    },
    items: {
        type: [{
            itemId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'food',
                required: true
            },
            name: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: [1, 'Quantity must be at least 1']
            },
            price: {
                type: Number,
                required: true,
                min: [0, 'Price cannot be negative']
            }
        }],
        required: [true, 'Order items are required'],
        validate: {
            validator: function(items) {
                return items && items.length > 0;
            },
            message: 'Order must contain at least one item'
        }
    },
    amount: {
        type: Number,
        required: [true, 'Total amount is required'],
        min: [0.01, 'Amount must be greater than 0']
    },
    status: {
        type: String,
        required: true,
        default: "Food Processing",
        enum: {
            values: ['Food Processing', 'Out for delivery', 'Delivered'],
            message: 'Status must be one of: Food Processing, Out for delivery, Delivered'
        }
    },
    address: {
        type: {
            street: {
                type: String,
                required: [true, 'Street address is required'],
                trim: true,
                minlength: [5, 'Street address must be at least 5 characters']
            },
            city: {
                type: String,
                required: [true, 'City is required'],
                trim: true,
                minlength: [2, 'City must be at least 2 characters']
            },
            state: {
                type: String,
                trim: true
            },
            zipcode: {
                type: String,
                required: [true, 'Zipcode is required'],
                trim: true,
                minlength: [5, 'Zipcode must be at least 5 characters']
            },
            country: {
                type: String,
                trim: true,
                default: 'India'
            }
        },
        required: [true, 'Address is required']
    },
    date: {
        type: Date,
        default: Date.now
    },
    payment: {
        type: Boolean,
        default: false
    },
    paymentMethod: {
        type: String,
        enum: ['razorpay', 'stripe', 'cash_on_delivery'],
        default: 'razorpay'
    }
}, {
    timestamps: true
});

// Add indexes for better performance
orderSchema.index({ userId: 1, date: -1 });
orderSchema.index({ status: 1 });

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;