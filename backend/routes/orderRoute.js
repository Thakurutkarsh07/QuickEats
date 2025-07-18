import express from "express";
import { placeOrder, verifyOrder, verifiedOrder, usersOrders, listOrder, updateStatus } from "../controllers/orderController.js";
import authMiddleware from "../middleware/auth.js";
import { body } from "express-validator";
import { handleValidationErrors } from "../middleware/validation.js";

const orderRouter = express.Router();

// Validation for order placement
const validateOrderPlacement = [
    body('items')
        .isArray({ min: 1 })
        .withMessage('Order must contain at least one item'),
    body('amount')
        .isFloat({ min: 0.01 })
        .withMessage('Order amount must be a positive number'),
    body('address')
        .isObject()
        .withMessage('Address must be an object'),
    body('address.street')
        .trim()
        .isLength({ min: 5, max: 200 })
        .withMessage('Street address must be between 5 and 200 characters'),
    body('address.city')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('City must be between 2 and 50 characters'),
    body('address.zipcode')
        .trim()
        .isLength({ min: 5, max: 10 })
        .withMessage('Zipcode must be between 5 and 10 characters'),
    handleValidationErrors
];

// Validation for order verification
const validateOrderVerification = [
    body('orderId')
        .isMongoId()
        .withMessage('Invalid order ID'),
    body('success')
        .isBoolean()
        .withMessage('Success must be a boolean value'),
    handleValidationErrors
];

// Validation for status update
const validateStatusUpdate = [
    body('orderId')
        .isMongoId()
        .withMessage('Invalid order ID'),
    body('status')
        .isIn(['Food Processing', 'Out for delivery', 'Delivered'])
        .withMessage('Invalid order status'),
    handleValidationErrors
];

// Order routes with validation
orderRouter.post("/place", authMiddleware, validateOrderPlacement, placeOrder);
orderRouter.post("/verify", validateOrderVerification, verifyOrder);
orderRouter.post("/verified", verifiedOrder);
orderRouter.post("/userorders", authMiddleware, usersOrders);
orderRouter.get("/list", listOrder);
orderRouter.post("/status", validateStatusUpdate, updateStatus);

export default orderRouter;